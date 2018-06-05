import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {Terms} from '../../api/terms/terms.js';
import {Subjects} from '../../api/subjects/subjects.js';
import {Weeks} from '../../api/weeks/weeks.js';
import {Lessons} from '../../api/lessons/lessons.js';
import _ from 'lodash'

function status (lessonsTotal, lessonsCompletedTotal) {
	if (!lessonsCompletedTotal) {
		return 'pending'
	} else if (lessonsTotal === lessonsCompletedTotal) {
		return 'completed'
	}
	return 'partial'
};

function getFirstLesson (lessons) {
	lessonWeekIds = []
	let lessonsCompletedWeekIds = [];
	let lessonIncompletedWeekIds = []
	lessons.forEach(function(lesson) {
		lessonWeekIds.push(lesson.weekId)
		if (lesson.completed) {
			lessonsCompletedWeekIds.push(lesson.weekId);
		} else {
			lessonIncompletedWeekIds.push(lesson.weekId);
		}
	});

	let partialWeeks = [];
	lessonWeekIds.forEach(function(weekId) {
		if (lessonsCompletedWeekIds.includes(weekId) && lessonIncompletedWeekIds.includes(weekId)) {
			partialWeeks.push(weekId);
		}
	});

	let lessonIds = lessons.map(lesson => (lesson._id));
	if (partialWeeks.length) {
		return Lessons.findOne({weekId: partialWeeks[0], deletedOn: { $exists: false }});
	}

	if (Lessons.find({_id: {$in: lessonIds}, completed: false, deletedOn: { $exists: false }}, {sort: {order: 1}}).count()) {
		return Lessons.findOne({_id: {$in: lessonIds}, completed: false, deletedOn: { $exists: false }}, {sort: {order: 1}});
	}

	return Lessons.findOne({_id: {$in: lessonIds}, completed: true, deletedOn: { $exists: false }}, {sort: {order: -1}});
};

export function studentStatusAndPaths(student, studentId, schoolYearId, termId, weekId) {
	let subjectIds = Subjects.find({studentId: studentId, schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(subject => (subject._id));

	// Year Status
	let yearLessonsTotal = Lessons.find({subjectId: {$in: subjectIds}, deletedOn: { $exists: false }}).count();
	let yearLessonsCompletedTotal = Lessons.find({subjectId: {$in: subjectIds}, completed: true, deletedOn: { $exists: false }}).count();
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

		let termLessonsTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: termWeeksIds}, deletedOn: { $exists: false }}).count();
		let termLessonsCompletedTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: termWeeksIds}, completed: true, deletedOn: { $exists: false }}).count();
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

		// First Week URL ID
		let weekIds = Weeks.find({termId: termId, deletedOn: { $exists: false }}).map(week => (week._id));
		let lessons = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weekIds}, deletedOn: { $exists: false }});

		if (lessons.count()) {
			let firstLesson = getFirstLesson(lessons);
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
		student.termProgress =  0;
		student.firstWeekId = 'empty';
	}

	// Week Status
	if (weekId) {
		let weekLessonsTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: weekId, deletedOn: { $exists: false }}).count();
		let weekLessonsCompletedTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: weekId, completed: true, deletedOn: { $exists: false }}).count();
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
		let subjectIds = Subjects.find({schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(subject => (subject._id));

		let lessons = Lessons.find({subjectId: {$in: subjectIds}, deletedOn: { $exists: false }});
		let lessonsCompleted = Lessons.find({subjectId: {$in: subjectIds}, completed: true, deletedOn: { $exists: false }});
		schoolYear.status = status(lessons.count(), lessonsCompleted.count());

		if (Terms.find({schoolYearId: schoolYearId, deletedOn: { $exists: false }}).count()) {
			if (lessons.count()) {
				let firstLesson = getFirstLesson(lessons);
				let firstWeek = Weeks.findOne({_id: firstLesson.weekId, deletedOn: { $exists: false }});

				schoolYear.firstTermId = firstWeek.termId;
				schoolYear.firstWeekId = firstLesson.weekId;
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
		let subjectIds = Subjects.find({studentId: studentId, schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(subject => (subject._id));

		let lessons = Lessons.find({subjectId: {$in: subjectIds}, deletedOn: { $exists: false }});
		let lessonsCompleted = Lessons.find({subjectId: {$in: subjectIds}, completed: true, deletedOn: { $exists: false }});
		schoolYear.status = status(lessons.count(), lessonsCompleted.count());

		if (Terms.find({schoolYearId: schoolYearId, deletedOn: { $exists: false }}).count()) {
			if (lessons.count()) {
				let firstLesson = getFirstLesson(lessons);
				let firstWeek = Weeks.findOne({_id: firstLesson.weekId, deletedOn: { $exists: false }});

				schoolYear.firstTermId = firstWeek.termId;
				schoolYear.firstWeekId = firstLesson.weekId;
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
		let subjectIds = Subjects.find({schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(subject => (subject._id));
		let weekIds = Weeks.find({termId: termId, deletedOn: { $exists: false }}).map(week => (week._id));

		let lessons = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weekIds}, deletedOn: { $exists: false }});
		let lessonsCompleted = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weekIds}, completed: true, deletedOn: { $exists: false }});
		term.status = status(lessons.count(), lessonsCompleted.count());

		if (termId) {
			if (lessons.count()) {
				let firstLesson = getFirstLesson(lessons);
				let firstWeek = Weeks.findOne({_id: firstLesson.weekId, deletedOn: { $exists: false }});

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
		let subjectIds = Subjects.find({studentId: studentId, schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(subject => (subject._id));
		let weekIds = Weeks.find({termId: termId, deletedOn: { $exists: false }}).map(week => (week._id));

		let lessons = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weekIds}, deletedOn: { $exists: false }});
		let lessonsCompleted = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weekIds}, completed: true, deletedOn: { $exists: false }});
		term.status = status(lessons.count(), lessonsCompleted.count());

		if (termId) {
			if (lessons.count()) {
				let firstLesson = getFirstLesson(lessons);
				let firstWeek = Weeks.findOne({_id: firstLesson.weekId, deletedOn: { $exists: false }});
			
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
		function getSubjectIds(schoolYear, studentId) {
			if (_.isNil(studentId)) {
			    return Subjects.find({schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(subject => (subject._id));
			} else {
				return Subjects.find({studentId: studentId, schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(subject => (subject._id));
			}
		}

		let termId = Weeks.findOne({_id: weekId, deletedOn: { $exists: false }}).termId;
		let schoolYearId = Terms.findOne({_id: termId, deletedOn: { $exists: false }}, {sort: {order: 1}}).schoolYearId;
		let subjectIds = getSubjectIds(schoolYearId, studentId);

		let lessonsTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: weekId, deletedOn: { $exists: false }}).count();
		let lessonsCompletedTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: weekId, completed: true, deletedOn: { $exists: false }}).count();
		week.status = status(lessonsTotal, lessonsCompletedTotal);
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






