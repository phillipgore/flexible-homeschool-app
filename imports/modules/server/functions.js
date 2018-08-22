import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {Terms} from '../../api/terms/terms.js';
import {SchoolWork} from '../../api/schoolWork/schoolWork.js';
import {Weeks} from '../../api/weeks/weeks.js';
import {Lessons} from '../../api/lessons/lessons.js';
import _ from 'lodash'

function status (lessonsTotal, lessonsCompletedTotal, lessonsAssignedTotal) {
	if (!lessonsTotal) {
		return 'empty'
	}
	if (!lessonsCompletedTotal && !lessonsAssignedTotal) {
		return 'pending'
	} 
	if (lessonsTotal === lessonsCompletedTotal) {
		return 'completed'
	}
	if (lessonsAssignedTotal) {
		return 'assigned'
	} 
	return 'partial'
};

function getFirstLesson (lessons, lessonsComplete, lessonsIncomplete) {
	let lessonWeekIds = lessons.map(lesson => lesson.weekId);
	let lessonsCompletedWeekIds = lessonsComplete.map(lesson => lesson.weekId);
	let lessonIncompletedWeekIds = lessonsIncomplete.map(lesson => lesson.weekId);

	let partialWeeks = [];
	lessonWeekIds.forEach(function(weekId) {
		if (lessonsCompletedWeekIds.includes(weekId) && lessonIncompletedWeekIds.includes(weekId)) {
			partialWeeks.push(weekId);
		}
	});

	let lessonIds = lessons.map(lesson => lesson._id);
	if (partialWeeks.length) {
		return Lessons.findOne({weekId: partialWeeks[0], deletedOn: { $exists: false }});
	}

	if (Lessons.find({_id: {$in: lessonIds}, completed: false, deletedOn: { $exists: false }}, {sort: {order: 1}}).count()) {
		return Lessons.findOne({_id: {$in: lessonIds}, completed: false, deletedOn: { $exists: false }}, {sort: {order: 1}});
	}

	return Lessons.findOne({_id: {$in: lessonIds}, completed: true, deletedOn: { $exists: false }}, {sort: {order: -1}});
};




export function studentPaths(student, studentId, schoolYearId, termId, weekId) {
	let schoolWorkIds = SchoolWork.find({studentId: studentId, schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(schoolWork => (schoolWork._id));

	// Term Status
	if (termId) {
		// First Week URL ID
		let weekIds = Weeks.find({termId: termId, deletedOn: { $exists: false }}).map(week => (week._id));
		let lessons = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: weekIds}, deletedOn: { $exists: false }});
		let lessonsComplete = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: weekIds}, deletedOn: { $exists: false }, completed: true});
		let lessonsInComplete = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: weekIds}, deletedOn: { $exists: false }, completed: false});

		if (lessons.count()) {
			let firstLesson = getFirstLesson(lessons, lessonsComplete, lessonsInComplete);
			let firstWeek = Weeks.findOne({_id: firstLesson.weekId, deletedOn: { $exists: false }});

			student.firstWeekId = firstWeek._id;
		} else {
			let firstWeek = Weeks.findOne({termId: termId, deletedOn: { $exists: false }}, {sort: {order: 1}})

			if (firstWeek) {
				student.firstWeekId = firstWeek._id;
			} else {
				student.firstWeekId = 'empty';	
			}
		}
	} else {
		student.firstWeekId = 'empty';
	}

	return student;
};




export function studentStats(student, studentId, schoolYearId, termId, weekId) {
	let schoolWorkIds = SchoolWork.find({studentId: studentId, schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(schoolWork => (schoolWork._id));

	// Year Status
	let yearLessonsTotal = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, deletedOn: { $exists: false }}).count();
	let yearLessonsCompletedTotal = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, completed: true, deletedOn: { $exists: false }}).count();
	let yearPercentComplete = yearLessonsCompletedTotal / yearLessonsTotal * 100;

	if (yearPercentComplete > 0 && yearPercentComplete < 1) {
		student.yearProgress = 1;
	} else {
		if (_.isNaN(Math.floor(yearPercentComplete))) {
			student.yearProgress =  0;
		} else {
			student.yearProgress =  Math.floor(yearPercentComplete);
		}
	}

	// Term Status
	if (termId) {
		let termWeeksIds = Weeks.find({termId: termId, deletedOn: { $exists: false }}).map(week => (week._id));

		let termLessonsTotal = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: termWeeksIds}, deletedOn: { $exists: false }}).count();
		let termLessonsCompletedTotal = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: termWeeksIds}, completed: true, deletedOn: { $exists: false }}).count();
		let termPercentComplete = termLessonsCompletedTotal / termLessonsTotal * 100;

		if (termPercentComplete > 0 && termPercentComplete < 1) {
			student.termProgress = 1;
		} else {
			if (_.isNaN(Math.floor(termPercentComplete))) {
				student.termProgress =  0;
			} else {
				student.termProgress =  Math.floor(termPercentComplete);
			}
		}
	} else {
		student.termProgress =  0;
	}

	// Week Status
	if (weekId) {
		let weekLessonsTotal = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: weekId, deletedOn: { $exists: false }}).count();
		let weekLessonsCompletedTotal = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: weekId, completed: true, deletedOn: { $exists: false }}).count();
		let weekPercentComplete = weekLessonsCompletedTotal / weekLessonsTotal * 100;

		if (weekPercentComplete > 0 && weekPercentComplete < 1) {
			student.weekProgress = 1;
		} else {
			if (_.isNaN(Math.floor(weekPercentComplete))) {
				student.weekProgress =  0;
			} else {
				student.weekProgress =  Math.floor(weekPercentComplete);
			}
		}
	} else {
		student.weekProgress =  0;
	}

	return student;
};




export function allSchoolYearsStatusAndPaths(schoolYear, schoolYearId) {
	if (schoolYearId) {
		let schoolWorkIds = SchoolWork.find({schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(schoolWork => (schoolWork._id));

		let lessons = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, deletedOn: { $exists: false }});
		let lessonsComplete = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, completed: true, deletedOn: { $exists: false }});
		let lessonsIncomplete = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, completed: false, deletedOn: { $exists: false }});
		let lessonsAssigned = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, completed: false, assigned: true, deletedOn: { $exists: false }});
		schoolYear.status = status(lessons.count(), lessonsComplete.count(), lessonsAssigned.count());

		if (Terms.find({schoolYearId: schoolYearId, deletedOn: { $exists: false }}).count()) {
			if (lessons.count()) {
				let firstWeekId = getFirstLesson(lessons, lessonsComplete, lessonsIncomplete).weekId;
				let firstWeek = Weeks.findOne({_id: firstWeekId, deletedOn: { $exists: false }});

				schoolYear.firstTermId = firstWeek.termId;
				schoolYear.firstWeekId = firstWeekId;
			} else {
				let firstTerm = Terms.findOne({schoolYearId: schoolYearId, deletedOn: { $exists: false }}, {sort: {order: 1}})
				let firstWeek = Weeks.findOne({termId: firstTerm._id, deletedOn: { $exists: false }}, {sort: {order: 1}})

				schoolYear.firstTermId = firstTerm._id;

				if (firstWeek) {
					schoolYear.firstWeekId = firstWeek._id;
				} else {
					schoolYear.firstWeekId = 'empty';	
				}
			}	
		} else {
			schoolYear.firstTermId = 'empty';
			schoolYear.firstWeekId = 'empty';
		}
	}

	return schoolYear;
};




export function studentSchoolYearsStatusAndPaths(schoolYear, schoolYearId, studentId) {
	if (schoolYearId) {
		let schoolWorkIds = SchoolWork.find({studentId: studentId, schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(schoolWork => (schoolWork._id));

		let lessons = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, deletedOn: { $exists: false }});
		let lessonsComplete = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, completed: true, deletedOn: { $exists: false }});
		let lessonsIncomplete = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, completed: false, deletedOn: { $exists: false }});
		let lessonsAssigned = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, completed: false, assigned: true, deletedOn: { $exists: false }});
		schoolYear.status = status(lessons.count(), lessonsComplete.count(), lessonsAssigned.count());

		if (Terms.find({schoolYearId: schoolYearId, deletedOn: { $exists: false }}).count()) {
			if (lessons.count()) {
				let firstWeekId = getFirstLesson(lessons, lessonsComplete, lessonsIncomplete).weekId;
				let firstWeek = Weeks.findOne({_id: firstWeekId, deletedOn: { $exists: false }});

				schoolYear.firstTermId = firstWeek.termId;
				schoolYear.firstWeekId = firstWeekId;
			} else {
				let firstTerm = Terms.findOne({schoolYearId: schoolYearId, deletedOn: { $exists: false }}, {sort: {order: 1}})
				let firstWeek = Weeks.findOne({termId: firstTerm._id, deletedOn: { $exists: false }}, {sort: {order: 1}})

				schoolYear.firstTermId = firstTerm._id;

				if (firstWeek) {
					schoolYear.firstWeekId = firstWeek._id;
				} else {
					schoolYear.firstWeekId = 'empty';	
				}
			}	
		} else {
			schoolYear.firstTermId = 'empty';
			schoolYear.firstWeekId = 'empty';
		}
	}

	return schoolYear;
};




export function allTermStatusAndPaths(term, termId, schoolYearId) {
	if (termId) {
		let schoolWorkIds = SchoolWork.find({schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(schoolWork => (schoolWork._id));
		let weekIds = Weeks.find({termId: termId, deletedOn: { $exists: false }}).map(week => (week._id));

		let lessons = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: weekIds}, deletedOn: { $exists: false }});
		let lessonsComplete = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: weekIds}, completed: true, deletedOn: { $exists: false }});
		let lessonsIncomplete = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: weekIds}, completed: false, deletedOn: { $exists: false }});
		let lessonsAssigned = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: weekIds}, completed: false, assigned: true, deletedOn: { $exists: false }});
		term.status = status(lessons.count(), lessonsComplete.count(), lessonsAssigned.count());

		if (termId) {
			if (lessons.count()) {
				let firstWeekId = getFirstLesson(lessons, lessonsComplete, lessonsIncomplete).weekId;
				let firstWeek = Weeks.findOne({_id: firstWeekId, deletedOn: { $exists: false }});

				term.firstWeekId = firstWeek._id;
			} else {
				let firstWeek = Weeks.findOne({termId: termId, deletedOn: { $exists: false }}, {sort: {order: 1}})

				if (firstWeek) {
					term.firstWeekId = firstWeek._id;
				} else {
					term.firstWeekId = 'empty';	
				}
			}
		} else {
			term.firstWeekId = 'empty';
		}
	}
	return term;
};




export function studentTermStatusAndPaths(term, termId, schoolYearId, studentId) {
	if (termId) {
		let schoolWorkIds = SchoolWork.find({studentId: studentId, schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(schoolWork => (schoolWork._id));
		let weekIds = Weeks.find({termId: termId, deletedOn: { $exists: false }}).map(week => (week._id));

		let lessons = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: weekIds}, deletedOn: { $exists: false }});
		let lessonsComplete = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: weekIds}, completed: true, deletedOn: { $exists: false }});
		let lessonsIncomplete = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: weekIds}, completed: false, deletedOn: { $exists: false }});
		let lessonsAssigned = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: weekIds}, completed: false, assigned: true, deletedOn: { $exists: false }});
		term.status = status(lessons.count(), lessonsComplete.count(), lessonsAssigned.count());

		if (termId) {
			if (lessons.count()) {
				let firstWeekId = getFirstLesson(lessons, lessonsComplete, lessonsIncomplete).weekId;
				let firstWeek = Weeks.findOne({_id: firstWeekId, deletedOn: { $exists: false }});
			
				term.firstWeekId = firstWeek._id;
			} else {
				let firstWeek = Weeks.findOne({termId: termId, deletedOn: { $exists: false }}, {sort: {order: 1}})

				if (firstWeek) {
					term.firstWeekId = firstWeek._id;
				} else {
					term.firstWeekId = 'empty';	
				}
			}
		} else {
			term.firstWeekId = 'empty';
		}
	}
	return term;
};




export function weekStatus(week, weekId, studentId) {
	if (weekId) {
		function getSchoolWorkIds(schoolYear, studentId) {
			if (_.isNil(studentId)) {
			    return SchoolWork.find({schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(schoolWork => (schoolWork._id));
			} else {
				return SchoolWork.find({studentId: studentId, schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(schoolWork => (schoolWork._id));
			}
		}

		let termId = Weeks.findOne({_id: weekId, deletedOn: { $exists: false }}).termId;
		let schoolYearId = Terms.findOne({_id: termId, deletedOn: { $exists: false }}, {sort: {order: 1}}).schoolYearId;
		let schoolWorkIds = getSchoolWorkIds(schoolYearId, studentId);

		let lessonsTotal = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: weekId, deletedOn: { $exists: false }}).count();
		let lessonsCompletedTotal = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: weekId, completed: true, deletedOn: { $exists: false }}).count();
		let lessonsAssignedTotal = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: weekId, completed: false, assigned: true, deletedOn: { $exists: false }}).count();
		week.status = status(lessonsTotal, lessonsCompletedTotal, lessonsAssignedTotal);
	}
	return week;
};




export function minutesConvert(minutes) {
	if (isNaN(minutes)) {
		return "0h 0m";
	}
	if (minutes === 60) {
		return "1h 0m";
	}
	if (minutes > 60) {
		let hours = Math.floor(minutes / 60);
		let minutesLeft = minutes - (hours * 60);
		return hours +"h "+ Math.round(minutesLeft) +"m";
	}
	if (minutes < 60) {
		let seconds = 60 * (minutes - Math.floor(minutes));
		return Math.floor(minutes) + "m "+ Math.round(seconds) +"s";
	}
};






