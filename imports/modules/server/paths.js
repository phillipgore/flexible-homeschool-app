import {Paths} from '../../api/paths/paths.js';
import {Groups} from '../../api/groups/groups.js';
import {Students} from '../../api/students/students.js';
import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {SchoolWork} from '../../api/schoolWork/schoolWork.js';
import {Terms} from '../../api/terms/terms.js';
import {Weeks} from '../../api/weeks/weeks.js';
import {Lessons} from '../../api/lessons/lessons.js';

import _ from 'lodash';

/* -------------------- Example: pathProperties -------------------- */

// let pathProperties = {
// 	studentIds: [],
// 	schoolYearIds: [],
// 	termIds:[],
// }

/* -------------------- Exported Functions -------------------- */

// Upsert Paths
export function upsertPaths(pathProperties, isNew) {
	let groupId = Meteor.user().info.groupId;

	let studentIds = getStudents(groupId, pathProperties);
	let schoolYearIds = getSchoolYears(groupId, pathProperties);
	let termIds = getTerms(groupId, schoolYearIds, pathProperties);

	if (studentIds.length && schoolYearIds.length) {
		studentIds.forEach(studentId => {
			schoolYearIds.forEach(schoolYearId => {
				schoolYearPath(groupId, studentId, schoolYearId)
			});

			if (termIds.length) {
				termIds.forEach(termId => {
					termYearPath(groupId, studentId, termId)
				});
			}
		});
	}

	if (isNew) {
		let weekId = Weeks.findOne({schoolYearId: {$in: schoolYearIds}, termId: {$in: termIds}}, {sort: {termOrder: 1, order: 1}})._id;
		return {schoolYearId: schoolYearIds[0], termId: termIds[0], weekId: weekId};
	} else {
		return true;
	}
};

// Upsert School Work Paths
export function upsertSchoolWorkPaths(pathProperties) {
	let groupId = Meteor.user().info.groupId;

	let studentIds = getStudents(groupId, pathProperties);
	let schoolYearIds = getSchoolYears(groupId, pathProperties);

	if (studentIds.length && schoolYearIds.length) {
		studentIds.forEach(studentId => {
			schoolYearIds.forEach(schoolYearId => {
				schoolWorkPath(groupId, studentId, schoolYearId)
			});
		});
	};
};



/* -------------------- Internal Functions -------------------- */

// Return Students
function getStudents(groupId, pathProperties) {
	if (pathProperties['studentIds'].length) {
		return pathProperties['studentIds']
	}

	let studentIds = Students.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, fields: {_id: 1}}).map(student => student._id)
	if (studentIds.length) {
		return studentIds;
	} else {
		return ['empty'];
	}
}

// Return School Years
function getSchoolYears(groupId, pathProperties) {
	if (pathProperties['schoolYearIds'].length) {
		return pathProperties['schoolYearIds']
	}

	let schoolYearIds = SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}, fields: {_id: 1}}).map(schoolYear => schoolYear._id)
	if (schoolYearIds.length) {
		return schoolYearIds;
	} else {
		return ['empty'];
	}
}


// Return Terms
function getTerms(groupId, schoolYearIds, pathProperties) {
	if (pathProperties['termIds'].length) {
		return pathProperties['termIds']
	}

	let termIds = Terms.find({schoolYearId: {$in: schoolYearIds}, groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {_id: 1}}).map(term => term._id)
	if (termIds.length) {
		return termIds;
	} else {
		return ['empty'];
	}
}


// School Year Path Upsert
function schoolYearPath(groupId, studentId, schoolYearId) {
	let path = {}
	path.studentId = studentId;
	path.timeFrameId = schoolYearId;
	path.type = 'schoolYear';
	path.groupId = groupId;
	path.createdOn = new Date();

	let firstIncompleteLesson = Lessons.findOne(
		{studentId: studentId, schoolYearId: schoolYearId, completed: false, deletedOn: { $exists: false }},
		{sort: {termOrder: 1, weekOrder: 1, order: 1}, fields: {termId: 1, weekId: 1}}
	);
	let firstCompletedLesson = Lessons.findOne(
		{studentId: studentId, schoolYearId: schoolYearId, completed: true, deletedOn: { $exists: false }},
		{sort: {termOrder: 1, weekOrder: 1, order: 1}, fields: {termId: 1, weekId: 1}}
	);

	if (firstIncompleteLesson) { // First Incomplete Lesson: True
		path.firstTermId = firstIncompleteLesson.termId;
		path.firstWeekId = firstIncompleteLesson.weekId;
	} else if (firstCompletedLesson) { // First Incomplete Lesson: false && First Complete Lesson: True
		path.firstTermId = firstCompletedLesson.termId;
		path.firstWeekId = firstCompletedLesson.weekId;
	} else { // First Incomplete Lesson: false && First Complete Lesson: False
		let firstTerm = Terms.findOne(
			{groupId: groupId, schoolYearId: schoolYearId, deletedOn: { $exists: false }},
			{sort: {order: 1}, fields: {_id: 1}}
		)

		if (firstTerm) { // First Term: True
			path.firstTermId = firstTerm._id
			let firstWeek = Weeks.findOne(
				{groupId: groupId, schoolYearId: schoolYearId, termId: firstTerm._id, deletedOn: { $exists: false }},
				{sort: {order: 1}, fields: {_id: 1}}
			)
			if (firstWeek) {path.firstWeekId = firstWeek._id} else {path.firstWeekId = 'empty'};
		} else { // First Term: False
			path.firstTermId = 'empty'
			path.firstWeekId = 'empty'
		};
	}

	let pathId = Paths.update({studentId: studentId, timeFrameId: schoolYearId, type: 'schoolYear'}, {$set: path}, {upsert: true});
};

// Term Path Upsert
function termYearPath(groupId, studentId, termId) {
	let path = {}
	path.studentId = studentId;
	path.timeFrameId = termId;
	path.type = 'term';
	path.groupId = groupId;
	path.createdOn = new Date();

	let firstIncompleteLesson = Lessons.findOne(
		{studentId: studentId, termId: termId, completed: false, deletedOn: { $exists: false }},
		{sort: {termOrder: 1, weekOrder: 1, order: 1}, fields: {termId: 1, weekId: 1}}
	);
	let firstCompletedLesson = Lessons.findOne(
		{studentId: studentId, termId: termId, completed: true, deletedOn: { $exists: false }},
		{sort: {termOrder: 1, weekOrder: 1, order: 1}, fields: {termId: 1, weekId: 1}}
	);

	if (firstIncompleteLesson) { // First Incomplete Lesson: True
		path.firstWeekId = firstIncompleteLesson.weekId;
	} else if (firstCompletedLesson) { // First Incomplete Lesson: false && First Complete Lesson: True
		path.firstWeekId = firstCompletedLesson.weekId;
	} else { // First Incomplete Lesson: false && First Complete Lesson: False
		let firstWeek = Weeks.findOne(
			{groupId: groupId, termId: termId, deletedOn: { $exists: false }},
			{sort: {order: 1}, fields: {_id: 1}}
		)
		if (firstWeek) {path.firstWeekId = firstWeek._id} else {path.firstWeekId = 'empty'};
	}

	let pathId = Paths.update({studentId: studentId, timeFrameId: termId, type: 'term'}, {$set: path}, {upsert: true});
};

// School Year Path Upsert
function schoolWorkPath(groupId, studentId, schoolYearId) {
	let path = {}
	path.studentId = studentId;
	path.timeFrameId = schoolYearId;
	path.type = 'schoolYear';
	path.groupId = groupId;
	path.createdOn = new Date();

	let firstSchoolWork = SchoolWork.findOne(
		{groupId: groupId, studentId: studentId, schoolYearId: schoolYearId, deletedOn: { $exists: false }},
		{sort: {name: 1}, fields: {_id: 1}}
	);

	if (firstSchoolWork) {
		path.firstSchoolWorkId = firstSchoolWork._id
	} else {
		path.firstSchoolWorkId = 'empty'
	}

	let pathId = Paths.update({studentId: studentId, timeFrameId: schoolYearId, type: 'schoolYear'}, {$set: path}, {upsert: true});
};






