import {Stats} from '../../api/stats/stats.js';
import {Groups} from '../../api/groups/groups.js';
import {Students} from '../../api/students/students.js';
import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {Terms} from '../../api/terms/terms.js';
import {Weeks} from '../../api/weeks/weeks.js';
import {SchoolWork} from '../../api/schoolWork/schoolWork.js';
import {Lessons} from '../../api/lessons/lessons.js';

import _ from 'lodash';

/* -------------------- Example: statProperties -------------------- */

// let statProperties = {
// 	studentIds: [],
// 	schoolYearIds: [],
// 	termIds:[],
// 	weekIds:[],
// }

/* -------------------- Exported Functions -------------------- */

// Insert Stats 
function insertStats(statProperties) {
	let groupId = Meteor.user().info.groupId;

	let students = getStudents(groupId, statProperties);
	let schoolYears = getSchoolYears(groupId, statProperties);
	let terms = getTerms(groupId, statProperties);
	let weeks = getWeeks(groupId, statProperties);

	students.forEach(student => {
		schoolYears.forEach(schoolYear => {
			insertSchoolYearStats(student._id, schoolYear._id);
		});

		terms.forEach(term => {
			insertTermStats(student._id, term._id);
		});

		weeks.forEach(week => {
			insertWeekStats(student._id, week._id);
		});
	});
}

// Update Stats
function updateStats(statProperties) {
	let groupId = Meteor.user().info.groupId;

	let students = getStudents(groupId, statProperties);
	let schoolYears = getSchoolYears(groupId, statProperties);
	let terms = getTerms(groupId, statProperties);
	let weeks = getWeeks(groupId, statProperties);

	students.forEach(student => {
		schoolYears.forEach(schoolYear => {
			updateSchoolYearStats(student._id, schoolYear._id);
		});

		terms.forEach(term => {
			updateTermStats(student._id, term._id);
		});

		weeks.forEach(week => {
			updateWeekStats(student._id, week._id);
		});
	});
}



/* -------------------- Internal Functions -------------------- */

// Return Students
function getStudents(groupId, statProperties) {
	if (pathProperties['studentIds'].length) {
		return pathProperties['studentIds']
	}

	let studentIds = Students.find({groupId: groupId, deletedOn: { $exists: false }}, {fields: {groupId: 1}}).map(student => student._id)
	if (studentIds.length) {
		return studentIds;
	} else {
		return ['empty'];
	}
}

// Return School Years
function getSchoolYears(groupId, statProperties) {
	if (pathProperties['schoolYearIds'].length) {
		return pathProperties['schoolYearIds']
	}

	let schoolYearIds = SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {fields: {groupId: 1}}).map(schoolYear => schoolYear._id)
	if (schoolYearIds.length) {
		return schoolYearIds;
	} else {
		return ['empty'];
	}
}

// Return Terms
function getTerms(groupId, statProperties) {
	if (pathProperties['termIds'].length) {
		return pathProperties['termIds']
	}

	let termIds = Terms.find({groupId: groupId, deletedOn: { $exists: false }}, {fields: {groupId: 1}}).map(term => term._id)
	if (termIds.length) {
		return termIds;
	} else {
		return ['empty'];
	}
}

// Return Weeks
function getWeeks(groupId, statProperties) {
	if (pathProperties['weekIds'].length) {
		return pathProperties['weekIds']
	}

	let weekIds = Weeks.find({groupId: groupId, deletedOn: { $exists: false }}, {fields: {groupId: 1}}).map(week => week._id)
	if (weekIds.length) {
		return weekIds;
	} else {
		return ['empty'];
	}
}



// Rounding
function rounding(complete, total) {
	if(complete && total) {
		let percentComplete = complete / total * 100
		if (percentComplete > 0 && percentComplete < 1) {
			return 1;
		}
		return Math.floor(percentComplete);
	}
	return 0;
};

// Status
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



// School Year Stats Insert
function insertSchoolYearStats(studentId, schoolWorkId) {
	let schoolYearLessons = Lessons.find({studentId: studentId, schoolYearId: schoolWorkId});
	let stats = {};

	stats.studentId = studentId;
	stats.timeFrameId = schoolWorkId;
	stats.type = 'schoolYear';
	stats.lessonCount = schoolYearLessons.length;
	stats.completedLessonCount = _.filter(schoolYearLessons, {'completed': true}).length;
	stats.assignedLessonCount = _.filter(schoolYearLessons, {'assigned': true}).length;
	stats.completedLessonPercentage = rounding(stats.completedLessonCount, stats.lessonCount);
	stats.status = status(stats.lessonCount, stats.completedLessonCount, stats.assignedLessonCount);
	stats.groupId = student.groupId;

	Stats.insert(stats);
};

// Terms Stats Insert
function insertTermStats(studentId, termId) {
	let termLessons = Lessons.find({studentId: studentId, termId: termId});
	let stats = {};

	stats.studentId = studentId;
	stats.timeFrameId = termId;
	stats.type = 'term';
	stats.lessonCount = termLessons.length;
	stats.completedLessonCount = _.filter(termLessons, {'completed': true}).length;
	stats.assignedLessonCount = _.filter(termLessons, {'assigned': true}).length;
	stats.completedLessonPercentage = rounding(stats.completedLessonCount, stats.lessonCount);
	stats.status = status(stats.lessonCount, stats.completedLessonCount, stats.assignedLessonCount);
	stats.groupId = student.groupId;

	Stats.insert(stats);
};

// Weeks Stats Insert
function insertWeekStats(studentId, weekId) {
	let weekLessons = Lessons.find({studentId: studentId, weekId: weekId});
	let stats = {};

	stats.studentId = studentId;
	stats.timeFrameId = weekId;
	stats.type = 'week';
	stats.lessonCount = weekLessons.length;
	stats.completedLessonCount = _.filter(weekLessons, {'completed': true}).length;
	stats.assignedLessonCount = _.filter(weekLessons, {'assigned': true}).length;
	stats.completedLessonPercentage = rounding(stats.completedLessonCount, stats.lessonCount);
	stats.status = status(stats.lessonCount, stats.completedLessonCount, stats.assignedLessonCount);
	stats.groupId = student.groupId;

	Stats.insert(stats);
};



// School Year Stats Update
function updateSchoolYearStats(studentId, schoolWorkId) {
	let schoolYearLessons = Lessons.find({studentId: studentId, schoolYearId: schoolWorkId});
	let stats = {};

	stats.lessonCount = schoolYearLessons.length;
	stats.completedLessonCount = _.filter(schoolYearLessons, {'completed': true}).length;
	stats.assignedLessonCount = _.filter(schoolYearLessons, {'assigned': true}).length;
	stats.completedLessonPercentage = rounding(stats.completedLessonCount, stats.lessonCount);
	stats.status = status(stats.lessonCount, stats.completedLessonCount, stats.assignedLessonCount);
	stats.groupId = student.groupId;

	Stats.update({studentId: studentId, timeFrameId: schoolWorkId}, {$set: stats});
};

// Terms Stats Update
function updateTermStats(studentId, termId) {
	let termLessons = Lessons.find({studentId: studentId, termId: termId});
	let stats = {};

	stats.lessonCount = termLessons.length;
	stats.completedLessonCount = _.filter(termLessons, {'completed': true}).length;
	stats.assignedLessonCount = _.filter(termLessons, {'assigned': true}).length;
	stats.completedLessonPercentage = rounding(stats.completedLessonCount, stats.lessonCount);
	stats.status = status(stats.lessonCount, stats.completedLessonCount, stats.assignedLessonCount);
	stats.groupId = student.groupId;

	Stats.update({studentId: studentId, timeFrameId: termId});
};

// Weeks Stats Update
function updateWeekStats(studentId, weekId) {
	let weekLessons = Lessons.find({studentId: studentId, weekId: weekId}, {$set: stats});
	let stats = {};

	stats.lessonCount = weekLessons.length;
	stats.completedLessonCount = _.filter(weekLessons, {'completed': true}).length;
	stats.assignedLessonCount = _.filter(weekLessons, {'assigned': true}).length;
	stats.completedLessonPercentage = rounding(stats.completedLessonCount, stats.lessonCount);
	stats.status = status(stats.lessonCount, stats.completedLessonCount, stats.assignedLessonCount);
	stats.groupId = student.groupId;

	Stats.update({studentId: studentId, timeFrameId: weekId}, {$set: stats});
};








