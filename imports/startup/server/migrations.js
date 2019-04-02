import {Groups} from '../../api/groups/groups.js';
import {Lessons} from '../../api/lessons/lessons.js';

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
								startDate: null,
								endDate: null,
								id: null,
								amountOff: null,
								percentOff: null,
							},
						};

						updatedGroupProperties.stripeCurrentCouponCode.startDate = result.discount.start;
						updatedGroupProperties.stripeCurrentCouponCode.endDate = result.discount.end;
						updatedGroupProperties.stripeCurrentCouponCode.id = result.discount.coupon.id;
						updatedGroupProperties.stripeCurrentCouponCode.amountOff = result.discount.coupon.amount_off;
						updatedGroupProperties.stripeCurrentCouponCode.percentOff = result.discount.coupon.percent_off;

						console.log(updatedGroupProperties)

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

Meteor.startup(() => {
	Migrations.migrateTo('2,rerun');
});

