import {Groups} from '../../api/groups/groups.js';
import {Students} from '../../api/students/students.js';
import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {Terms} from '../../api/terms/terms.js';
import {Weeks} from '../../api/weeks/weeks.js';
import {SchoolWork} from '../../api/schoolWork/schoolWork.js';
import {Resources} from '../../api/resources/resources.js';
import {Lessons} from '../../api/lessons/lessons.js';
import {Reports} from '../../api/reports/reports.js';

import moment from 'moment';


/* -------------------- Exported Functions -------------------- */

// Intial Ids for Student, School Year, Term, Week and School Work.
export function primaryInitialIds () {
	let groupId = Meteor.user().info.groupId;
	let currentYear = startYearFunction()

	let ids = {};

	let firstStudent = Students.findOne({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, fields: {_id: 1}});
	if (firstStudent) {ids.studentId = firstStudent._id} else {ids.studentId = 'empty'};

	let firstSchoolYear = SchoolYears.findOne({groupId: groupId, startYear: {$gte: currentYear}, deletedOn: { $exists: false }}, {sort: {starYear: 1}, fields: {_id: 1}});
	if (firstSchoolYear) {ids.schoolYearId = firstSchoolYear._id} else {ids.schoolYearId = 'empty'};

	if (firstStudent && firstSchoolYear) {
		let firstSchoolWork = SchoolWork.findOne(
			{groupId: groupId, schoolYearId: firstSchoolYear._id, studentId: firstStudent._id, deletedOn: { $exists: false }},
			{sort: {name: 1}, fields: {_id: 1}}
		)	
		ids.schoolWorkId = firstSchoolWork._id;
	} else {
		ids.schoolWorkId = 'empty';
	}

	if (ids.schoolYearId === 'empty') {
		ids.termId = 'empty';
		ids.weekId = 'empty';
	} else {
		let firstIncompleteLesson = Lessons.findOne(
			{studentId: firstStudent._id, schoolYearId: firstSchoolYear._id, completed: false, deletedOn: { $exists: false }},
			{sort: {termOrder: 1, weekOrder: 1, order: 1}, fields: {termId: 1, weekId: 1}}
		);
		let firstCompletedLesson = Lessons.findOne(
			{studentId: firstStudent._id, schoolYearId: firstSchoolYear._id, completed: true, deletedOn: { $exists: false }},
			{sort: {termOrder: 1, weekOrder: 1, order: 1}, fields: {termId: 1, weekId: 1}}
		);

		if (firstIncompleteLesson) {
			ids.termId = firstIncompleteLesson.termId;
			ids.weekId = firstIncompleteLesson.weekId;
		} else if (firstCompletedLesson) {
			ids.termId = firstCompletedLesson.termId;
			ids.weekId = firstCompletedLesson.weekId;
		} else {
			let firstTerm = Terms.findOne(
				{groupId: groupId, schoolYearId: firstSchoolYear._id, deletedOn: { $exists: false }},
				{sort: {order: 1}, fields: {_id: 1}}
			)
			let firstWeek = Weeks.findOne(
				{groupId: groupId, schoolYearId: firstSchoolYear._id, termId: firstTerm._id, deletedOn: { $exists: false }},
				{sort: {order: 1}, fields: {_id: 1}}
			)
			if (firstTerm) {ids.termId = firstTerm._id} else {ids.termId = 'empty'};
			if (firstWeek) {ids.weekId = firstWeek._id} else {ids.weekId = 'empty'};
		}
	}



	Groups.update(groupId, {$set: {
		'initialIds.studentId': ids.studentId,
		'initialIds.schoolYearId': ids.schoolYearId,
		'initialIds.termId': ids.termId,
		'initialIds.weekId': ids.weekId,
		'initialIds.schoolWorkId': ids.schoolWorkId,
	}});
	
	return groupId;
};

// Intial Ids for Resources.
export function resourcesInitialIds () {
	let groupId = Meteor.user().info.groupId;
	let ids = {};

	let firstResource = Resources.findOne({groupId: groupId, deletedOn: { $exists: false }}, {sort: {title: 1}, fields: {type: 1}});
	if (firstResource) {ids.resourceId = firstResource._id} else {ids.resourceId = 'empty'};
	if (firstResource) {ids.resourceType = firstResource.type} else {ids.resourceType = 'empty'};

	Groups.update(groupId, {$set: {
		'initialIds.resourceId': ids.resourceId,
		'initialIds.resourceType': ids.resourceType,
	}});
	
	return groupId;
};

// Intial Id for Users.
export function usersInitialId () {
	let groupId = Meteor.user().info.groupId;
	let ids = {};

	let firstUser = Meteor.users.findOne({'info.groupId': groupId, 'emails.0.verified': true, 'status.active': true}, {sort: {'info.lastName': 1, 'info.firstName': 1}});
	ids.userId = firstUser._id;

	Groups.update(groupId, {$set: {
		'initialIds.userId': ids.userId,
	}});
	
	return groupId;
};

// Intial Id for Reports.
export function reportsInitialId () {
	let groupId = Meteor.user().info.groupId;
	let ids = {};

	let firstReport = Reports.findOne({groupId: groupId, deletedOn: { $exists: false }}, {sort: {name: 1}});
	if (firstReport) {ids.reportId = firstReport._id} else {ids.reportId = 'empty'};

	Groups.update(groupId, {$set: {
		'initialIds.reportId': ids.reportId,
	}});
	
	return groupId;
};

// Intial Id for Groups.
export function groupsInitialId () {
	let groupId = Meteor.user().info.groupId;
	let group = Groups.findOne({_id: groupId});
	let ids = {};

	if (group.appAdmin) {
		let firstGroup = Groups.findOne({appAdmin: false}, {fields: {_id: 1}, sort: {createdOn: -1}}); 
		if (firstGroup) {ids.groupId = firstGroup._id} else {ids.groupId = 'empty'};
	} else {
		ids.groupId = 'empty'
	}

	Groups.update(groupId, {$set: {
		'initialIds.groupId': ids.groupId,
	}});

	return group._id;
};



/* -------------------- Internal Functions -------------------- */

// Return the Start Year
function startYearFunction() {
	let year = moment().year();
	let month = moment().month();

	if (month < 6) {
		return year = (year - 1).toString();
	}
	return year.toString();
}









