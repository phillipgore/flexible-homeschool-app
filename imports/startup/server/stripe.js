import {Groups} from '../../api/groups/groups';
import stripePackage from 'stripe';
const stripe = stripePackage(Meteor.settings.private.stripe);



Meteor.methods({
	createSubscription: async function(groupId, cardId, subscriptionProperties) {

		let updatedGroupProperties = {
			subscriptionStatus: 'pending',
			stripeCardId: cardId,
			stripeCouponCodes: subscriptionProperties.subscription.coupon
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
		}).catch((error) => {
			updatedGroupProperties.subscriptionStatus = 'error';
			updatedGroupProperties.subscriptionErrorMessage = error.raw.message;
		});

		Groups.update(groupId, {$set: updatedGroupProperties}, function(error, result) {
			if (error) {
				throw new Meteor.Error(500, error);
			} else {
				return result;
			}
		});
	},

	applyCoupon: async function(stripeSubscriptionId, stripeCouponCode) {
		let groupId = Meteor.user().info.groupId;
		
		let result = await stripe.subscriptions.update(
			stripeSubscriptionId, 
			{coupon: stripeCouponCode}
		).catch((error) => {
			throw new Meteor.Error(500, error.message);
		});

		Groups.update(groupId, {$push: {stripeCouponCodes: stripeCouponCode}}, function(error, result) {
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
				return result;
			}
		});

	},

	unpauseSubscription: async function() {
		let groupId = Meteor.user().info.groupId;
		let customerId = Groups.findOne({_id: groupId}).stripeCustomerId;
		let subscriptionId = Groups.findOne({_id: groupId}).stripeSubscriptionId;
		let groupProperties = {
			subscriptionStatus: 'active',
		}

		let result = stripe.subscriptions.retrieve(
			subscriptionId
		).then((subscription) => {
			if (subscription.status === 'canceled') {
				let result = stripe.subscriptions.create({
					customer: customerId,
					items: [{plan: Meteor.settings.public.stripePlanId}]
				}).then((subscription) => {
					groupProperties.stripeSubscriptionId = result.id;
				}).catch((error) => {
					throw new Meteor.Error(500, error.message);
				});
			}
			if (subscription.status === 'active' && subscription.cancel_at_period_end === true) {
				let result = stripe.subscriptions.update(subscription.id, {
					items: [{
						id: subscription.items.data[0].id,
						plan: Meteor.settings.public.stripePlanId,
					}]
				}).then((subscription) => {
					groupProperties.stripeSubscriptionId = result.id
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
				return result;
			}
		});

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
			customer: customerId, limit: 10
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
			throw new Meteor.Error(500, error.message);
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









