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


// Intial Ids for Student, School Year, Term, Week, School Work.
export function primaryInitialIds () {
	console.log('primaryInitialIds function started');
	let groupId = Meteor.user().info.groupId;
	
	let year = moment().year();
		let month = moment().month();

	function startYearFunction(year) {
		if (month < 6) {
			return year = (year - 1).toString();
		}
		return year.toString();
	}
	let currentYear = startYearFunction(year)

	let ids = {};

	let firstStudent = Students.findOne({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, fields: {_id: 1}});
	if (firstStudent) {ids.studentId = firstStudent._id} else {ids.studentId = 'empty'};

	let firstSchoolYear = SchoolYears.findOne({groupId: groupId, startYear: {$gte: currentYear}, deletedOn: { $exists: false }}, {sort: {starYear: 1}, fields: {_id: 1}});
	if (firstSchoolYear) {ids.schoolYearId = firstSchoolYear._id} else {ids.schoolYearId = 'empty'};

	if (ids.schoolYearId === 'empty') {
		ids.termId = 'empty';
		ids.weekId = 'empty';
		ids.schoolWorkId = 'empty'
	} else {
		let firstIncompleteLesson = Lessons.findOne(
			{studentId: firstStudent._id, schoolYearId: firstSchoolYear._id, completed: false, deletedOn: { $exists: false }},
			{sort: {termOrder: 1, weekOrder: 1, order: 1}, fields: {termId: 1, weekId: 1, schoolWorkId: 1}}
		);
		let firstCompletedLesson = Lessons.findOne(
			{studentId: firstStudent._id, schoolYearId: firstSchoolYear._id, completed: true, deletedOn: { $exists: false }},
			{sort: {termOrder: 1, weekOrder: 1, order: 1}, fields: {termId: 1, weekId: 1, schoolWorkId: 1}}
		);

		if (firstIncompleteLesson) {
			ids.termId = firstIncompleteLesson.termId;
			ids.weekId = firstIncompleteLesson.weekId;
			ids.schoolWorkId = firstIncompleteLesson.schoolWorkId
		} else if (firstCompletedLesson) {
			ids.termId = firstCompletedLesson.termId;
			ids.weekId = firstCompletedLesson.weekId;
			ids.schoolWorkId = firstCompletedLesson.schoolWorkId
		} else {
			let firstTerm = Terms.findOne(
				{groupId: groupId, schoolYearId: firstSchoolYear._id, deletedOn: { $exists: false }},
				{sort: {order: 1}, fields: {_id: 1}}
			)
			let firstWeek = Weeks.findOne(
				{groupId: groupId, schoolYearId: firstSchoolYear._id, termId: firstTerm._id, deletedOn: { $exists: false }},
				{sort: {order: 1}, fields: {_id: 1}}
			)
			let firstSchoolWork = SchoolWork.findOne(
				{groupId: groupId, schoolYearId: firstSchoolYear._id, studentId: firstStudent._id, deletedOn: { $exists: false }},
				{sort: {order: 1}, fields: {_id: 1}}
			)
			if (firstTerm) {ids.termId = firstTerm._id} else {ids.termId = 'empty'};
			if (firstWeek) {ids.weekId = firstWeek._id} else {ids.weekId = 'empty'};
			if (firstSchoolWork) {ids.schoolWorkId = firstSchoolWork._id} else {ids.schoolWorkId = 'empty'};
		}
	}

	Groups.update(groupId, {$set: {
		'initialIds.studentId': ids.studentId,
		'initialIds.schoolYearId': ids.schoolYearId,
		'initialIds.termId': ids.termId,
		'initialIds.weekId': ids.weekId,
		'initialIds.schoolWorkId': ids.schoolWorkId,
	}});
	console.log('primaryInitialIds function ended');
	return groupId;
};

// Intial Ids for Resources.
export function resourcesInitialIds (groupId) {
	console.log('resourcesInitialIds function started');
	let ids = {};

	let firstResource = Resources.findOne({groupId: groupId, deletedOn: { $exists: false }}, {sort: {title: 1}, fields: {type: 1}});
	if (firstResource) {ids.resourceId = firstResource._id} else {ids.resourceId = 'empty'};
	if (firstResource) {ids.resourceType = firstResource.type} else {ids.resourceType = 'empty'};

	Groups.update(groupId, {$set: {initialIds: ids}});
	console.log('resourcesInitialIds function ended');
	return groupId;
};

// Intial Id for Users.
export function usersInitialId (groupId) {
	console.log('usersInitialId function started');
	let ids = {};

	let firstUser = Meteor.users.findOne({'info.groupId': groupId, 'emails.0.verified': true, 'status.active': true}, {sort: {'info.lastName': 1, 'info.firstName': 1}});
	ids.userId = firstUser._id;

	Groups.update(groupId, {$set: {initialIds: ids}});
	console.log('usersInitialId function ended');
	return groupId;
};

// Intial Id for Reports.
export function reportsInitialId (groupId) {
	console.log('reportsInitialId function started');
	let ids = {};

	let firstReport = Reports.findOne({groupId: groupId, deletedOn: { $exists: false }}, {sort: {name: 1}});
	if (firstReport) {ids.reportId = firstReport._id} else {ids.reportId = 'empty'};

	Groups.update(groupId, {$set: {initialIds: ids}});
	console.log('reportsInitialId function ended');
	return groupId;
};

// Intial Id for Groups.
export function groupsInitialId (group) {
	console.log('groupsInitialId function started');
	let ids = {};

	if (group.appAdmin) {
		let firstGroup = Groups.findOne({appAdmin: false}, {fields: {_id: 1}, sort: {createdOn: -1}}); 
		if (firstGroup) {ids.groupId = firstGroup._id} else {ids.groupId = 'empty'};
	} else {
		ids.groupId = 'empty'
	}

	Groups.update(group._id, {$set: {initialIds: ids}});
	console.log('groupsInitialId function ended');
	return group._id;
};









