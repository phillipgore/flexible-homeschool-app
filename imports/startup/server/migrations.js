import {Paths} from '../../api/paths/paths.js';
import {Stats} from '../../api/stats/stats.js';
import {Groups} from '../../api/groups/groups.js';
import {Students} from '../../api/students/students.js';
import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {Terms} from '../../api/terms/terms.js';
import {Weeks} from '../../api/weeks/weeks.js';
import {SchoolWork} from '../../api/schoolWork/schoolWork.js';
import {Resources} from '../../api/resources/resources.js';
import {Lessons} from '../../api/lessons/lessons.js';
import {Reports} from '../../api/reports/reports.js';

import {primaryInitialIds} from '../../modules/server/initialIds';
import {resourcesInitialIds} from '../../modules/server/initialIds';
import {usersInitialId} from '../../modules/server/initialIds';
import {reportsInitialId} from '../../modules/server/initialIds';
import {groupsInitialId} from '../../modules/server/initialIds';

import {upsertPaths} from '../../modules/server/paths';
import {upsertSchoolWorkPaths} from '../../modules/server/paths';
import {upsertStats} from '../../modules/server/stats';


import moment from 'moment';
import _ from 'lodash'

Migrations.add({
	version: 1,
	name: 'Add schoolWorkId to Lessons. Remove subjectId from Lessons.',
	up: function() {
		Lessons.find().forEach(lesson => {
			let schoolWorkId = lesson.subjectId;
			Lessons.update({_id: lesson._id}, {$set: {schoolWorkId: schoolWorkId}, $unset: {subjectId: ''}})
		})
	}
});

Migrations.add({
	version: 2,
	name: 'Add Stripe coupon data.',
	up: function() {
		Groups.find().forEach(group => {
			let stripeSubscriptionId = group.stripeSubscriptionId;
			if (!_.isUndefined(stripeSubscriptionId)) {
				Meteor.call('getSubscription', stripeSubscriptionId, function(error, result) {
					if (error) {
						console.log(error)
					} else {
						let updatedGroupProperties = {
							subscriptionStatus: group.subscriptionStatus,
							stripeCardId: group.stripeCardId,
							stripeCouponCodes: group.stripeCouponCodes,
							stripeCurrentCouponCode: {
								startDate: result.discount.start,
								endDate: result.discount.end,
								id: result.discount.coupon.id,
								amountOff: result.discount.coupon.amount_off,
								percentOff: result.discount.coupon.percent_off,
							},
						};

						Groups.update(group._id, {$set: updatedGroupProperties}, function(error, result) {
							if (error) {
								console.log(error);
							} else {
								return result;
							}
						});
					}
				})
			}
		})
	}
});

Migrations.add({
	version: 3,
	name: 'Delete lessons that reference missing weeks.',
	up: function() {
		let refWeekIds = _.uniq(Lessons.find().map(lesson => lesson.weekId));
		let weekIds = _.uniq(Weeks.find().map(week => week._id));
		refWeekIds.forEach(weekId => {
			if (_.indexOf(weekIds, weekId) < 0) {
				Lessons.remove({weekId: weekId})
			}
		})
	}
});

Migrations.add({
	version: 4,
	name: 'Remove Deleted Items.',
	up: function() {
		Students.remove({deletedOn: { $exists: true }});
		SchoolYears.remove({deletedOn: { $exists: true }});
		Terms.remove({deletedOn: { $exists: true }});
		Weeks.remove({deletedOn: { $exists: true }});
		SchoolWork.remove({deletedOn: { $exists: true }});
		Lessons.remove({deletedOn: { $exists: true }});
		Reports.remove({deletedOn: { $exists: true }});

		let resourceIds = Resources.find({deletedOn: { $exists: true }}).map(resource => resource._id);
		SchoolWork.update({}, {$pull: {resources: {$in: resourceIds}}}, {multi: true});

		Resources.remove({deletedOn: { $exists: true }});
	}
});

Migrations.add({
	version: 5,
	name: 'Add Foreign Id fields to Weeks and Lessons.',
	up: function() {
		let weeks = Weeks.find({}, {fields: {termId: 1}}).fetch();
		let terms = Terms.find({}, {fields: {schoolYearId: 1}}).fetch();

		weeks.forEach(week => {
			let schoolYearId = _.filter(terms, ['_id', week.termId])[0].schoolYearId;
			Weeks.update(week._id, {$set: {schoolYearId: schoolYearId}});
		});

		let lessons = Lessons.find({}, {fields: {_id: 1, schoolWorkId: 1, weekId: 1}});
		let schoolWork = SchoolWork.find({}, {fields: {studentId: 1, schoolYearId: 1}}).fetch();

		lessons.forEach(lesson => {
			let schoolWorkProperties = _.filter(schoolWork, ['_id', lesson.schoolWorkId])[0];
			let termId = _.filter(weeks, ['_id', lesson.weekId])[0].termId;

			let lessonProperties = {
				studentId: schoolWorkProperties.studentId,
				schoolYearId: schoolWorkProperties.schoolYearId,
				termId: termId,
			}

			Lessons.update(lesson._id, {$set: lessonProperties})
		});
	}
});

Migrations.add({
	version: 6,
	name: 'Add orders to Weeks and Lessons.',
	up: function() {
		let terms = Terms.find({}, {fields: {order: 1}}).fetch();
		let weeks = Weeks.find({}, {fields: {order: 1, termId: 1}}).fetch()

		weeks.forEach(week => {
			let termOrder = _.find(terms, ['_id', week.termId]).order
			Weeks.update(week._id, {$set: {termOrder: termOrder}});
		});


		Lessons.find({deletedOn: { $exists: false }}, {fields: {order: 1, termId: 1, weekId: 1}}).forEach(lesson => {
			let termOrder = _.find(terms, ['_id', lesson.termId]).order
			let weekOrder = _.find(weeks, ['_id', lesson.weekId]).order

			let lessonOrderString = lesson.order.toString();
			let lessonDotIndex = lessonOrderString.indexOf('.') + 1;
			let lessonOrder = parseInt(lessonOrderString.slice(lessonDotIndex));

			Lessons.update(lesson._id, {$set: {termOrder: termOrder, weekOrder: weekOrder, order: lessonOrder}});
		});
	}
});

Migrations.add({
	version: 7,
	name: 'Add intial ids to Group collection',
	up: function() {
		let groupIds = _.uniq(Groups.find({}, {fields: {_id: 1}}).map(group => group._id));
		console.log(groupIds.length)
		
		groupIds.forEach((groupId, index) => {
			
			primaryInitialIds(groupId);
			resourcesInitialIds(groupId);
			usersInitialId(groupId);
			reportsInitialId(groupId);
			groupsInitialId(groupId);

		});
	}
});

Migrations.add({
	version: 8,
	name: 'Create Paths Collection.',
	up: function() {
		Groups.find({}, {fields: {_id: 1}}).forEach(group => {

			let groupId = group._id;

			let students = Students.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, fields: {_id: 1}});
			let schoolYears = SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}, fields: {_id: 1}});
			let terms = Terms.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {_id: 1}});

			let pathProperties = {
				studentIds: Students.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, fields: {_id: 1}}).map(student => student._id),
				schoolYearIds: SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}, fields: {_id: 1}}).map(schoolYear => schoolYear._id),
				termIds: Terms.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {_id: 1}}).map(term => term._id),
			}

			upsertPaths(pathProperties, false, groupId);
			upsertSchoolWorkPaths(pathProperties, groupId);

		});
	}
});

Migrations.add({
	version: 9,
	name: 'Create Stats Collection.',
	up: function() {
		
		let groups = Groups.find({}, {sort: {_id: -1}});
		console.log(groups.count())

		let students = Students.find({deletedOn: { $exists: false }}, {fields: {groupId: 1}});
		let schoolYears = SchoolYears.find({deletedOn: { $exists: false }}, {fields: {groupId: 1}});
		let terms = Terms.find({deletedOn: { $exists: false }}, {fields: {groupId: 1}});
		let weeks = Weeks.find({deletedOn: { $exists: false }}, {fields: {groupId: 1}});

		groups.forEach((group, index) => {
			console.log(index + 1)
			let statProperties = {
				studentIds: _.filter(students, {groupId: group._id}).map(student => student._id),
				schoolYearIds: _.filter(schoolYears, {groupId: group._id}).map(schoolYear => schoolYear._id),
				termIds: _.filter(terms, {groupId: group._id}).map(term => term._id),
				weekIds: _.filter(weeks, {groupId: group._id}).map(week => week._id),
			}

			upsertStats(statProperties, group._id);
		});
	}
});

Meteor.startup(() => {
	Migrations.migrateTo(9);
});










