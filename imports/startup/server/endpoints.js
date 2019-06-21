import bodyParser from 'body-parser';
import {Picker} from 'meteor/meteorhacks:picker';
import {Groups} from '../../api/groups/groups';

Picker.middleware(bodyParser.json());

Picker.route('/webhooks/stripe', (params, request, response) => {
	let {body} = request

	if (body.type === 'invoice.payment_failed') {
		let customerId = body.data.object.customer;
		let attemptCount = body.data.object.attempt_count;

		Groups.update({stripeCustomerId: customerId}, {$set: {stripePaymentAttempt: attemptCount}});
	}
	if (body.type === 'invoice.payment_succeeded') {
		let customerId = body.data.object.customer;

		Groups.update({stripeCustomerId: customerId}, {$set: {stripePaymentAttempt: 0, subscriptionStatus: 'active'}}, function() {
			let group = Groups.findOne({stripeCustomerId: customerId});
			Meteor.call('mcTags', group._id);
		});
	}
	if (body.type === 'customer.subscription.deleted') {
		let customerId = body.data.object.customer;
		let group = Groups.findOne({stripeCustomerId: customerId})

		if (group) {
			if (group.subscriptionStatus === 'pausePending' || group.subscriptionStatus === 'paused') {
				Groups.update({stripeCustomerId: customerId}, {$set: {subscriptionStatus: 'paused'}}, function() {
					Meteor.call('mcTags', group._id);
				});
			} else {
				Groups.update({stripeCustomerId: customerId}, {$set: {subscriptionStatus: 'error'}}, function() {
					Meteor.call('mcTags', group._id);
				});
			}
		}
	}
	response.writeHead(200);
	response.end('[200] Webhook recieved.')
});