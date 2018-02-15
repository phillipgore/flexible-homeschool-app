import bodyParser from 'body-parser';
import { Picker } from 'meteor/meteorhacks:picker';
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

		Groups.update({stripeCustomerId: customerId}, {$set: {stripePaymentAttempt: 0, subscriptionStatus: 'active'}});
	}
	if (body.type === 'customer.subscription.deleted') {
		let customerId = body.data.object.customer;
		let groupStatus = Groups.findOne({stripeCustomerId: customerId}).subscriptionStatus

		if (groupStatus === 'pausePending' || groupStatus === 'paused') {
			Groups.update({stripeCustomerId: customerId}, {$set: {subscriptionStatus: 'paused'}});
		} else {
			Groups.update({stripeCustomerId: customerId}, {$set: {subscriptionStatus: 'error'}});
		}
	}
	response.writeHead(200);
	response.end('[200] Webhook recieved.')
});