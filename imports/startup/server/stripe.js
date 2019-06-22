import {Groups} from '../../api/groups/groups';
import stripePackage from 'stripe';
const stripe = stripePackage(Meteor.settings.private.stripe);



Meteor.methods({
	createSubscription: async function(groupId, cardId, subscriptionProperties) {

		let updatedGroupProperties = {
			subscriptionStatus: 'pending',
			stripeCardId: cardId,
			stripeCouponCodes: subscriptionProperties.subscription.coupon,
			stripeCurrentCouponCode: {
				startDate: null,
				endDate: null,
				id: null,
				amountOff: null,
				percentOff: null,
			},
		};

		let result = await stripe.customers.create(
			subscriptionProperties.customer
		).then((customer) => {
			updatedGroupProperties.stripeCustomerId = customer.id;
			subscriptionProperties.subscription.customer = customer.id;

			return stripe.subscriptions.create(
				subscriptionProperties.subscription
			);
		}).then((subscription) => {
			updatedGroupProperties.subscriptionStatus = 'active';
			updatedGroupProperties.stripeSubscriptionId = subscription.id;
			updatedGroupProperties.subscriptionErrorMessage = null;

			if (subscription.discount) {
				updatedGroupProperties.stripeCurrentCouponCode.startDate = subscription.discount.start;
				updatedGroupProperties.stripeCurrentCouponCode.endDate = subscription.discount.end;
				updatedGroupProperties.stripeCurrentCouponCode.id = subscription.discount.coupon.id;
				updatedGroupProperties.stripeCurrentCouponCode.amountOff = subscription.discount.coupon.amount_off;
				updatedGroupProperties.stripeCurrentCouponCode.percentOff = subscription.discount.coupon.percent_off;
			}

			return subscription;
		}).catch((error) => {
			updatedGroupProperties.subscriptionStatus = 'error';
			updatedGroupProperties.subscriptionErrorMessage = error.message;
		});

		Groups.update(groupId, {$set: updatedGroupProperties}, function(error, result) {
			if (error) {
				throw new Meteor.Error(500, error);
			} else {
				Meteor.call('mcTags', groupId);
				return result;
			}
		});
	},

	applyCoupon: async function(stripeSubscriptionId, stripeCouponCode) {
		let groupId = Meteor.user().info.groupId;
		let updatedGroupProperties = {
			stripeCurrentCouponCode: {
				startDate: null,
				endDate: null,
				id: null,
				amountOff: null,
				percentOff: null,
			},
		}
		
		let result = await stripe.subscriptions.update(
			stripeSubscriptionId, 
			{coupon: stripeCouponCode.toLowerCase()}
		).then((subscription) => {
			updatedGroupProperties.stripeCurrentCouponCode.startDate = subscription.discount.start;
			updatedGroupProperties.stripeCurrentCouponCode.endDate = subscription.discount.end;
			updatedGroupProperties.stripeCurrentCouponCode.id = subscription.discount.coupon.id;
			updatedGroupProperties.stripeCurrentCouponCode.amountOff = subscription.discount.coupon.amount_off;
			updatedGroupProperties.stripeCurrentCouponCode.percentOff = subscription.discount.coupon.percent_off;

			return subscription;
		}).catch((error) => {
			throw new Meteor.Error(500, error.message);
		});

		Groups.update(groupId, {
			$set: updatedGroupProperties, 
			$push: {stripeCouponCodes: stripeCouponCode}
		}, function(error, result) {
			if (error) {
				throw new Meteor.Error(500, error);
			} else {
				return result;
			}
		});

	},

	pauseSubscription: async function() {
		let groupId = Meteor.user().info.groupId;
		let subscriptionId = Groups.findOne({_id: groupId}).stripeSubscriptionId;
		let groupProperties = {
			subscriptionStatus: 'pausePending', 
		}

		let result = await stripe.subscriptions.del(
			subscriptionId, {at_period_end: true}
		).then((confirmation) => {
			let date = new Date(confirmation.current_period_end * 1000);
			groupProperties.subscriptionPausedOn = date.toUTCString();
		}).catch((error) => {
			throw new Meteor.Error(500, error.message);
		});

		Groups.update(groupId, {$set: groupProperties}, function(error, result) {
			if (error) {
				throw new Meteor.Error(500, error);
			} else {
				Meteor.call('mcTags', groupId);
				return result;
			}
		});

	},

	unpauseSubscription: async function(couponCode) {
		console.log('one: ' + couponCode)
		let groupId = Meteor.user().info.groupId;
		let customerId = Groups.findOne({_id: groupId}).stripeCustomerId;
		let subscriptionId = Groups.findOne({_id: groupId}).stripeSubscriptionId;
		let groupProperties = {
			subscriptionStatus: 'active',
		}

		let result = stripe.subscriptions.retrieve(
			subscriptionId
		).then((subscription) => {
			console.log(subscription)
			if (subscription.status === 'canceled') {
				let subscriptionProperties = {
					customer: customerId,
					items: [{plan: Meteor.settings.public.stripePlanId}]
				}
				if (couponCode.length) {
					subscriptionProperties.coupon = couponCode;
				}
				let result = stripe.subscriptions.create(
					subscriptionProperties
				).then((subscription) => {
					groupProperties.stripeSubscriptionId = subscription.id;
					if (subscription.discount) {
						groupProperties.stripeCurrentCouponCode.startDate = subscription.discount.start;
						groupProperties.stripeCurrentCouponCode.endDate = subscription.discount.end;
						groupProperties.stripeCurrentCouponCode.id = subscription.discount.coupon.id;
						groupProperties.stripeCurrentCouponCode.amountOff = subscription.discount.coupon.amount_off;
						groupProperties.stripeCurrentCouponCode.percentOff = subscription.discount.coupon.percent_off;
					}
				}).catch((error) => {
					throw new Meteor.Error(500, error.message);
				});
			} else if (subscription.cancel_at_period_end === true) {
				let result = stripe.subscriptions.update(subscription.id, {
					items: [{
						id: subscription.items.data[0].id,
						plan: Meteor.settings.public.stripePlanId,
					}]
				}).then((subscription) => {
					groupProperties.stripeSubscriptionId = subscription.id
				}).catch((error) => {
					throw new Meteor.Error(500, error.message);
				});
			}
			return subscription;
		}).catch((error) => {
			throw new Meteor.Error(500, error.message);
		});

		Groups.update(groupId, {$set: groupProperties}, function(error, result) {
			if (error) {
				throw new Meteor.Error(500, error);
			} else {
				Meteor.call('mcTags', groupId);
				return result;
			}
		});
	},

	getSubscription: async function(subscriptionId) {
		let result = await stripe.subscriptions.retrieve(
			subscriptionId
		).then((subscription) => {
			return subscription;
		}).catch((error) => {
			throw new Meteor.Error(500, error.message);
		});

		return result;
	},

	getSubscriptionDiscount: async function() {
		let groupId = Meteor.user().info.groupId;
		let subscriptionId = Groups.findOne({_id: groupId}).stripeSubscriptionId;

		let result = await stripe.subscriptions.retrieve(
			subscriptionId
		).then((subscription) => {
			return subscription.discount;
		}).catch((error) => {
			throw new Meteor.Error(500, error.message);
		});

		return result;
	},

	getCard: async function() {
		let groupId = Meteor.user().info.groupId;
		let customerId = Groups.findOne({_id: groupId}).stripeCustomerId;
		let cardId = Groups.findOne({_id: groupId}).stripeCardId;

		let result = await stripe.customers.retrieveCard(
			customerId, cardId
		).then((card) => {
			return card;
		}).catch((error) => {
			throw new Meteor.Error(500, error.message);
		});

		return result;
	},

	getCardBrand: async function() {
		let groupId = Meteor.user().info.groupId;
		let customerId = Groups.findOne({_id: groupId}).stripeCustomerId;
		let cardId = Groups.findOne({_id: groupId}).stripeCardId;

		let result = await stripe.customers.retrieveCard(
			customerId, cardId
		).then((card) => {
			return card;
		}).catch((error) => {
			throw new Meteor.Error(500, error.message);
		});

		return result.brand;
	},

	getCouponList: async function() {
		let result = await stripe.coupons.list(
			
		).then((couponList) => {
			return couponList;
		}).catch((error) => {
			throw new Meteor.Error(500, error.message);
		});

		return result;
	},

	getCoupon: async function(couponId) {
		let result = await stripe.coupons.retrieve(
			couponId
		).then((coupon) => {
			return coupon;
		}).catch((error) => {
			throw new Meteor.Error(500, error.message);
		});

		return result;
	},

	getInvoices: async function() {
		let groupId = Meteor.user().info.groupId;
		let customerId = Groups.findOne({_id: groupId}).stripeCustomerId;

		let result = await stripe.invoices.list({
			customer: customerId, limit: 24
		}).then((invoices) => {
			return invoices;
		}).catch((error) => {
			throw new Meteor.Error(500, error.message);
		});

		return result;
	},

	getUpcomingInvoices: async function() {
		let groupId = Meteor.user().info.groupId;
		let customerId = Groups.findOne({_id: groupId}).stripeCustomerId;

		let result = await stripe.invoices.retrieveUpcoming(
			customerId
		).then((invoices) => {
			return invoices;
		}).catch((error) => {
			console.log(Meteor.Error(500, error.message));
		});

		return result;
	},

	updateCard: async function(tokenId) {
		let groupId = Meteor.user().info.groupId;
		let customerId = Groups.findOne({_id: groupId}).stripeCustomerId;
		let groupProperties = {
			subscriptionErrorMessage: null
		};

		let result = await stripe.customers.update(customerId, {
			source: tokenId
		}).then((customer) => {
			groupProperties.stripeCardId = customer.default_source;
		}).catch((error) => {
			throw new Meteor.Error(500, error.message);
		});

		Groups.update(groupId, {$set: groupProperties}, function(error, result) {
			if (error) {
				throw new Meteor.Error(500, error);
			} else {
				return result;
			}
		});
	},
});









