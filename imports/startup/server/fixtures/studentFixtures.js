import {Groups} from '../../../api/groups/groups.js';
import {Students} from '../../../api/students/students.js';
import {StudentGroups} from '../../../api/studentGroups/studentGroups.js';
import {SchoolYears} from '../../../api/schoolYears/schoolYears.js';
import {Terms} from '../../../api/terms/terms.js';
import {Weeks} from '../../../api/weeks/weeks.js';

import {primaryInitialIds, studentGroupsInitialId} from '../../../modules/server/initialIds';
import {upsertPaths, upsertSchoolWorkPaths} from '../../../modules/server/paths';
import {upsertStats} from '../../../modules/server/stats';

Meteor.methods({
	addStudentFixtures() {
		let groupId = Meteor.user().info.groupId;
		let userId = Meteor.userId();

		if (!Groups.findOne({_id: groupId}).appAdmin) {
			throw new Meteor.Error('no-role-app', 'You do not have permission to add test data.');
		}

		let fixtureStudents = [
			{
				firstName: 'Lanaya',
				middleName: 'Elizabeth',
				lastName: 'Gore',
				nickname: 'Liz',
				preferredFirstName: {
					type: 'middleName',
					name: 'Elizabeth',
				},
				birthday: new Date(2004, 12, 3),
				groupId: groupId, 
				userId: userId, 
				createdOn: new Date()
			},
			{
				firstName: 'Jonathan',
				middleName: 'Ashford',
				lastName: 'Gore',
				nickname: 'Jon',
				preferredFirstName: {
					type: 'firstName',
					name: 'Jonathan',
				},
				birthday: new Date(2008, 8, 2),
				groupId: groupId, 
				userId: userId, 
				createdOn: new Date()
			},
			{
				firstName: 'Phoebe',
				middleName: 'Ruth',
				lastName: 'Gore',
				preferredFirstName: {
					type: 'firstName',
					name: 'Phoebe',
				},
				birthday: new Date(2010, 4, 12),
				groupId: groupId, 
				userId: userId, 
				createdOn: new Date()
			},
			{
				firstName: 'Harrison',
				middleName: 'Lee',
				lastName: 'Gore',
				nickname: 'Harry',
				preferredFirstName: {
					type: 'firstName',
					name: 'Harrison',
				},
				birthday: new Date(2014, 6, 6),
				groupId: groupId, 
				userId: userId, 
				createdOn: new Date()
			},
		];

		// Insert Students
		Students.batchInsert(fixtureStudents, function() {
			Groups.update(groupId, {$set: {'fixtureData.hasStudentData': true}});

			let pathProperties = {
				studentIds: Students.find({groupId: groupId}).map(student => student._id),
				studentGroupIds: StudentGroups.find({groupId: groupId}, {sort: {name: 1}, fields: {_id: 1}}).map(studentGroup => studentGroup._id),
				schoolYearIds: SchoolYears.find({groupId: groupId}).map(schoolYear => schoolYear._id),
				termIds: Terms.find({groupId: groupId}).map(term => term._id),
			}

			upsertPaths(pathProperties, false, groupId);
			upsertSchoolWorkPaths(pathProperties, groupId);

			let statProperties = {
				studentIds: Students.find({groupId: groupId}).map(student => student._id),
				schoolYearIds: SchoolYears.find({groupId: groupId}).map(schoolYear => schoolYear._id),
				termIds: Terms.find({groupId: groupId}).map(term => term._id),
				weekIds: Weeks.find({groupId: groupId}).map(week => week._id),
			}
			
			upsertStats(statProperties, groupId);
			primaryInitialIds(groupId);
		});

		// Insert Student Groups
		let students = Students.find({groupId: groupId}, {sort: {age: 1}}).fetch();
		let studentDivide = Math.ceil(students.length / 2);
		let olderStudentIds = students.slice(0, studentDivide).map(student => student._id);
		let youngerStudentIds = students.slice(studentDivide).map(student => student._id);

		let fixtureStudentGroups = [
			{
				name: 'Family Work',
				studentIds: students.map(student => student._id),
				groupId: groupId, 
				userId: userId, 
				createdOn: new Date(),
			},
			{
				name: 'Older Students',
				studentIds: olderStudentIds,
				groupId: groupId, 
				userId: userId, 
				createdOn: new Date(),
			},
			{
				name: 'Younger Students',
				studentIds: youngerStudentIds,
				groupId: groupId, 
				userId: userId, 
				createdOn: new Date(),
			},
		];

		StudentGroups.batchInsert(fixtureStudentGroups);

		return Groups.findOne({_id: groupId}).initialIds;
	}
});