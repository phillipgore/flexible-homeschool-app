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

function getFirstLesson(lessons, lessonsComplete, lessonsIncomplete) {
	let lessonWeekIds = lessons.map(lesson => lesson.weekId);
	let lessonsCompleteWeekIds = lessonsComplete.map(lesson => lesson.weekId);
	let lessonIncompletedWeekIds = lessonsIncomplete.map(lesson => lesson.weekId);

	let partialWeeks = [];
	lessonWeekIds.forEach(function(weekId) {
		if (lessonsCompleteWeekIds.includes(weekId) && lessonIncompletedWeekIds.includes(weekId)) {
			partialWeeks.push(weekId);
		}
	});

	if (partialWeeks.length) {
		return _.filter(lessons, ['weekId', partialWeeks[0]])[0];
		// return Lessons.findOne({weekId: partialWeeks[0], deletedOn: { $exists: false }}, {fields: {weekId: 1}});
	}

	if (lessonsIncomplete.length) {
		let lessonIncompleteIds = lessonsIncomplete.map(lesson => lesson._id);
		return _.orderBy(_.filter(lessons, lesson => _.includes(lessonIncompleteIds, lesson._id)), ['order'], ['asc'])[0];
		// return Lessons.findOne({_id: {$in: lessonIncompleteIds}}, {sort: {order: 1}, fields: {weekId: 1}});
	}

	let lessonsCompleteIds = lessonsComplete.map(lesson => lesson._id);
	return _.orderBy(_.filter(lessons, lesson => _.includes(lessonsCompleteIds, lesson._id)), ['order'], ['desc'])[0];
	// return Lessons.findOne({_id: {$in: lessonsCompleteIds}}, {sort: {order: -1}, fields: {weekId: 1}});
};




export function studentPaths(student, studentId, schoolYearId, termId, weekId) {
	// Term Status
	if (termId) {	
		let schoolWorkIds = SchoolWork.find({studentId: studentId, schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(schoolWork => (schoolWork._id));

		// First Week URL ID
		let weekIds = Weeks.find({termId: termId, deletedOn: { $exists: false }}).map(week => (week._id));
		let lessons = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: weekIds}, deletedOn: { $exists: false }}, {fields: {completed: 1, weekId: 1}});
		
		if (lessons.count()) {
			let lessonsComplete = _.filter(lessons, ['completed', true]);
			let lessonsIncomplete = _.filter(lessons, ['completed', false]);

			let firstWeekId = getFirstLesson(lessons, lessonsComplete, lessonsInComplete).weekId;
			let firstWeek = Weeks.findOne({_id: firstWeekId, deletedOn: { $exists: false }});

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
	let lessons = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, deletedOn: { $exists: false }}, {fields: {completed: 1}}).fetch();
	let yearLessonsTotal = lessons.length;
	let yearLessonsCompletedTotal = _.filter(lessons, ['completed', true]).length;
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

		let lessons = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: termWeeksIds}, deletedOn: { $exists: false }}, {fields: {completed: 1}}).fetch();
		let termLessonsTotal = lessons.length;
		let termLessonsCompletedTotal = _.filter(lessons, ['completed', true]).length;
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
		let lessons = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: weekId, deletedOn: { $exists: false }}, {fields: {completed: 1}}).fetch()
		let weekLessonsTotal = lessons.length;
		let weekLessonsCompletedTotal = _.filter(lessons, ['completed', true]).length;
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

		let lessons = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, deletedOn: { $exists: false }}, {fields: {completed: 1, assigned: 1, weekId: 1}}).fetch();
		let lessonsComplete = _.filter(lessons, ['completed', true]);
		let lessonsIncomplete = _.filter(lessons, ['completed', false]);	
		let lessonsAssigned = _.filter(lessons, {'completed': false, 'assigned': true});

		schoolYear.status = status(lessons.length, lessonsComplete.length, lessonsAssigned.length);

		if (Terms.find({schoolYearId: schoolYearId, deletedOn: { $exists: false }}).length) {
			if (lessons.length) {
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




export function studentSchoolYearsStatusAndPaths(studentId, schoolYear, lessons) {
	// console.log('studentId: ' + studentId);
	// console.log('schoolYear: ' + schoolYear);
	// console.log('lesson length: ' + lessons.length);

	if (schoolYear) {
		let lessonsComplete = _.filter(lessons, ['completed', true]);
		let lessonsIncomplete = _.filter(lessons, ['completed', false]);	
		let lessonsAssigned = _.filter(lessons, {'completed': false, 'assigned': true});

		// console.log('lessonsComplete: ' + lessonsComplete);
		// console.log('lessonsIncomplete: ' + lessonsIncomplete);
		// console.log('lessonsAssigned: ' + lessonsAssigned);

		let term = Terms.findOne({schoolYearId: schoolYear._id, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {_id: 1}})
		// console.log('term: ' + term);

		schoolYear.status = status(lessons.length, lessonsComplete.length, lessonsAssigned.length);
		// console.log('schoolYear.status: ' + schoolYear.status);

		if (term) {
			// console.log('term')
			if (lessons.length) {
				// console.log('lessons')
				let firstWeekId = getFirstLesson(lessons, lessonsComplete, lessonsIncomplete).weekId;
				// console.log('firstWeekId: ' + firstWeekId);
				let firstWeek = Weeks.findOne({_id: firstWeekId, deletedOn: { $exists: false }});
				// console.log('firstWeek: ' + firstWeek);

				schoolYear.firstTermId = firstWeek.termId;
				schoolYear.firstWeekId = firstWeekId;
			} else {
				// console.log('no lessons')
				let firstTerm = term
				// console.log('firstTerm: ' + firstTerm);
				let firstWeek = Weeks.findOne({termId: firstTerm._id, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {_id: 1}})
				// console.log('firstWeek: ' + firstWeek);

				schoolYear.firstTermId = firstTerm._id;
				// console.log('firstTermId: ' + schoolYear.firstTermId);

				if (firstWeek) {
					schoolYear.firstWeekId = firstWeek._id;
				} else {
					schoolYear.firstWeekId = 'empty';	
				}
				// console.log('firstWeekId: ' + schoolYear.firstWeekId);
			}	
		} else {
			// console.log('no term')
			schoolYear.firstTermId = 'empty';
			schoolYear.firstWeekId = 'empty';
		}
	}

	// console.log('schoolYear: ' + schoolYear);
	return schoolYear;
};




export function allTermStatusAndPaths(term, termId, schoolYearId) {
	if (termId) {
		let schoolWorkIds = SchoolWork.find({schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(schoolWork => (schoolWork._id));
		let weekIds = Weeks.find({termId: termId, deletedOn: { $exists: false }}).map(week => (week._id));

		let lessons = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, deletedOn: { $exists: false }}, {fields: {completed: 1, assigned: 1, weekId: 1}}).fetch();
		let lessonsComplete = _.filter(lessons, ['completed', true]);
		let lessonsIncomplete = _.filter(lessons, ['completed', false]);	
		let lessonsAssigned = _.filter(lessons, {'completed': false, 'assigned': true});

		term.status = status(lessons.length, lessonsComplete.length, lessonsAssigned.length);

		if (lessons.length) {
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
	return term;
};




export function studentTermStatusAndPaths(term, termId, schoolYearId, studentId) {
	if (termId) {
		let schoolWorkIds = SchoolWork.find({studentId: studentId, schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(schoolWork => (schoolWork._id));
		let weekIds = Weeks.find({termId: termId, deletedOn: { $exists: false }}).map(week => (week._id));

		let lessons = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: weekIds}, deletedOn: { $exists: false }}, {fields: {completed: 1, assigned: 1, weekId: 1}}).fetch();
		let lessonsComplete = _.filter(lessons, ['completed', true]);
		let lessonsIncomplete = _.filter(lessons, ['completed', false]);	
		let lessonsAssigned = _.filter(lessons, {'completed': false, 'assigned': true});

		term.status = status(lessons.length, lessonsComplete.length, lessonsAssigned.length);

		if (lessons.length) {
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
	return term;
};




export function weekStatus(week, weekId, schoolYearId, studentId) {
	if (weekId) {
		function getSchoolWorkIds(schoolYear, studentId) {
			if (_.isNil(studentId)) {
			    return SchoolWork.find({schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(schoolWork => (schoolWork._id));
			} else {
				return SchoolWork.find({studentId: studentId, schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(schoolWork => (schoolWork._id));
			}
		}

		let schoolWorkIds = getSchoolWorkIds(schoolYearId, studentId);
		let lessons = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, weekId: weekId, deletedOn: { $exists: false }}, {fields: {completed: 1, assigned: 1}}).fetch()
		let lessonsTotal = lessons.length;
		let lessonsCompletedTotal = _.filter(lessons, ['completed', true]).length;
		let lessonsAssignedTotal = _.filter(lessons, {'completed': false, 'assigned': true}).length;
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






