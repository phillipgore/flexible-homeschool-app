import {Paths} from '../../api/paths/paths.js';
import {Groups} from '../../api/groups/groups.js';
import {Students} from '../../api/students/students.js';
import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {Terms} from '../../api/terms/terms.js';
import {Weeks} from '../../api/weeks/weeks.js';
import {SchoolWork} from '../../api/schoolWork/schoolWork.js';
import {Resources} from '../../api/resources/resources.js';
import {Lessons} from '../../api/lessons/lessons.js';
import {Reports} from '../../api/reports/reports.js';

import _ from 'lodash';

/* -------------------- Exported Functions -------------------- */

// Update Paths: General
export function updatePaths(pathProperties) {
	let groupId = Meteor.user().info.groupId;

	let studentIds = getStudents(groupId, pathProperties);
	let schoolYearIds = getSchoolYears(groupId, pathProperties);
	let termIds = getTerms(groupId, schoolYearIds, pathProperties);

	studentIds.forEach(studentId => {
		schoolYearIds.forEach(schoolYearId => {
			schoolYearPath(groupId, studentId, schoolYearId)
		});

		termIds.forEach(termId => {
			termYearPath(groupId, studentId, termId)
		});
	});

	return true;
};



/* -------------------- Internal Functions -------------------- */

// Return Students
function getStudents(groupId, pathProperties) {
	if (pathProperties['studentIds'].length) {
		return pathProperties['studentIds']
	}

	let studentIds = Students.find({groupId: groupId, deletedOn: { $exists: false }}, {fields: {_id: 1}}).map(student => student._id)
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

	let schoolYearIds = SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {fields: {_id: 1}}).map(schoolYear => schoolYear._id)
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

	let termIds = Terms.find({schoolYearId: {$in: schoolYearIds}, groupId: groupId, deletedOn: { $exists: false }}, {fields: {_id: 1}}).map(term => term._id)
	if (termIds.length) {
		return termIds;
	} else {
		return ['empty'];
	}
}


// School Year Path Update
function schoolYearPath(groupId, studentId, schoolYearId) {
	let path = {}
	path.studentId = studentId;
	path.timeFrameId = schoolYearId;
	path.type = 'schoolYear';
	path.groupId = groupId;

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
			if (firstWeek) {path.firstWeekId = firstWeek._id} else {path.weekId = 'empty'};
		} else { // First Term: False
			path.firstTermId = 'empty'
			path.firstWeekId = 'empty'
		};
	}

	let pathId = Paths.update({studentId: studentId, timeFrameId: schoolYearId, type: 'schoolYear'}, {$set: path});
	console.log('schoolYear: ' + pathId);
};

// Term Path Update
function termYearPath(groupId, studentId, termId) {
	let path = {}
	path.studentId = studentId;
	path.timeFrameId = termId;
	path.type = 'term';
	path.groupId = groupId;

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
		if (firstWeek) {path.firstWeekId = firstWeek._id} else {path.weekId = 'empty'};
	}

	let pathId = Paths.update({studentId: studentId, timeFrameId: termId, type: 'term'}, {$set: path});
	console.log('term: ' + pathId);
};







