import {Groups} from '../../api/groups/groups.js';

import {Students} from '../../api/students/students.js';
import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {Terms} from '../../api/terms/terms.js';
import {Weeks} from '../../api/weeks/weeks.js';
import {SchoolWork} from '../../api/schoolWork/schoolWork.js';
import {Lessons} from '../../api/lessons/lessons.js';
import {Reports} from '../../api/reports/reports.js';
import {Resources} from '../../api/resources/resources.js';

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
		console.log('migration 2')
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
				console.log(weekId);
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


Meteor.startup(() => {
	Migrations.migrateTo(4);
});




