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
			updatedGroupProperties.stripeTokenId = customer.source;
			updatedGroupProperties.stripeCustomerId = customer.id;
			subscriptionProperties.subscription.customer = customer.id;

			return stripe.subscriptions.create(
				subscriptionProperties.subscription
			);
		}).then((subscription) => {
			updatedGroupProperties.subscriptionStatus = 'active';
			updatedGroupProperties.stripeSubscriptionId = subscription.id;

			return updatedGroupProperties
		}).catch((error) => {
			updatedGroupProperties.subscriptionStatus = 'error';
			updatedGroupProperties.subscriptionError = error.raw;

			return updatedGroupProperties;
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

	updateCard: async function() {

	},
});









