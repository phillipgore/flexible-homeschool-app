import {Groups} from '../../api/groups/groups';
import stripePackage from 'stripe';
const stripe = stripePackage(Meteor.settings.private.stripe);



Meteor.methods({
	createSubscription: async function(subscriptionProperties) {

		let updatedGroupProperties = {
			subscriptionStatus: 'pending',
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

			return updatedGroupProperties
		}).catch((error) => {
			updatedGroupProperties.subscriptionStatus = 'error';
			updatedGroupProperties.subscriptionErrorMessage = error.raw.message;

			return updatedGroupProperties;
		});

		return result;
	},

	pauseSubscription: async function() {
		let groupId = Meteor.user().info.groupId;
		let subscriptionId = Groups.findOne({_id: groupId}).stripeSubscriptionId;

		let result = await stripe.subscriptions.del(
			subscriptionId, {at_period_end: true}
		).then((confirmation) => {
			return confirmation;
		}).catch((error) => {
			throw new Meteor.Error(500, error.message);
		});

		return result
	},

	unpauseSubscription: async function() {
		let groupId = Meteor.user().info.groupId;
		let customerId = Groups.findOne({_id: groupId}).stripeCustomerId;
		let subscriptionId = Groups.findOne({_id: groupId}).stripeSubscriptionId;

		let result = stripe.subscriptions.retrieve(
			subscriptionId
		).then((subscription) => {
			if (subscription.status === 'canceled') {
				let result = stripe.subscriptions.create({
					customer: customerId,
					items: [{plan: 'standard'}]
				}).then((subscription) => {
					return subscription
				}).catch((error) => {
					throw new Meteor.Error(500, error.message);
				});

				return result;
			}
			if (subscription.status === 'active' && subscription.cancel_at_period_end === true) {
				let result = stripe.subscriptions.update(subscription.id, {
					items: [{
						id: subscription.items.data[0].id,
						plan: 'standard',
					}]
				}).then((subscription) => {
					return subscription
				}).catch((error) => {
					throw new Meteor.Error(500, error.message);
				});

				return result;
			}
		}).catch((error) => {
			throw new Meteor.Error(500, error.message);
		});

		return result
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

		let result = await stripe.customers.update(customerId, {
			source: tokenId
		}).then((customer) => {
			return customer;
		}).catch((error) => {
			throw new Meteor.Error(500, error.message);
		});

		return result;
	},
});









