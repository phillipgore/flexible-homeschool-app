import {Groups} from '../../../api/groups/groups.js';
import {Students} from '../../../api/students/students.js';
import {SchoolYears} from '../../../api/schoolYears/schoolYears.js';
import {Terms} from '../../../api/terms/terms.js';
import {Weeks} from '../../../api/weeks/weeks.js';

import {primaryInitialIds, resourcesInitialIds, usersInitialId, reportsInitialId, groupsInitialId} from '../../../modules/server/initialIds';
import {upsertPaths, upsertSchoolWorkPaths} from '../../../modules/server/paths';
import {upsertStats} from '../../../modules/server/stats';

import moment from 'moment';

Meteor.methods({
	addSchoolYearFixtures() {
		let groupId = Meteor.user().info.groupId;
		let userId = Meteor.userId();

		if (!Groups.findOne({_id: groupId}).appAdmin) {
			throw new Meteor.Error('no-role-app', 'You do not have permission to add test data.');
		}

		function startYearFunction() {
			let year = moment().year();
			let month = moment().month();

			if (month < 6) {
				return year = (year - 1);
			}

			return year;
		};

		let startYear = startYearFunction();

		let fixtureSchoolYears = [
			{
				startYear: (startYear - 1).toString(),
				endYear: startYear.toString(),
				groupId: groupId, 
				userId: userId, 
				createdOn: new Date()
			},
			{
				startYear: startYear.toString(),
				endYear: (startYear + 1).toString(),
				groupId: groupId, 
				userId: userId, 
				createdOn: new Date()
			},
			{
				startYear: (startYear + 1).toString(),
				endYear: (startYear + 2).toString(),
				groupId: groupId, 
				userId: userId, 
				createdOn: new Date()
			},
		];

		let fixtureTerms =  [];

		let fixtureWeeks = [];

		// Insert School Years
		SchoolYears.batchInsert(fixtureSchoolYears)

		// Insert Terms
		SchoolYears.find({groupId: groupId}).forEach(schoolYear => {
			let termOrders = [1, 2, 3];
			termOrders.forEach(termOrder => {
				fixtureTerms.push(
					{
						_id: Random.id(),
						order: parseInt(termOrder), 
						schoolYearId: schoolYear._id,
						groupId: groupId, 
						userId: userId, 
						createdOn: new Date()
					}
				)
			});		
		});
		Terms.batchInsert(fixtureTerms)

		// Insert Weeks
		Terms.find({groupId: groupId}).forEach(term => {
			let weekOrders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
			weekOrders.forEach(weekOrder => {
				fixtureWeeks.push({
					_id: Random.id(),
					order: parseInt(weekOrder),
					termOrder: term.order,
					schoolYearId: term.schoolYearId,
					termId: term._id,
					groupId: groupId,
					userId: userId,
					createdOn: new Date()
				})
			});
		});

		Weeks.batchInsert(fixtureWeeks, function() {
			Groups.update(groupId, {$set: {'fixtureData.hasSchoolYearData': true}});

			let pathProperties = {
				studentIds: Students.find({groupId: groupId}).map(student => student._id),
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

		return Groups.findOne({_id: groupId}).initialIds;
	}
});