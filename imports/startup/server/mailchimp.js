import Mailchimp from 'mailchimp-api-v3';
const mailchimp = new Mailchimp(Meteor.settings.private.mailchimp);


Meteor.methods({
	mcSubscription: function(mcSubscriptionProperties) {
		mailchimp.put('/lists/' + Meteor.settings.private.mailchimpListId + '/members/' + mcSubscriptionProperties.emailHash, {
			"email_address": mcSubscriptionProperties.email,
			"status": "subscribed",
			"merge_fields": {
				"FNAME": mcSubscriptionProperties.firstName,
				"LNAME": mcSubscriptionProperties.lastName
			}
		}).then((subscription) => {
			mailchimp.post('/lists/' + Meteor.settings.private.mailchimpListId + '/segments/' + Meteor.settings.private.mailchimpSegmentId + '/members', {
				"email_address": subscription.email_address
			});
		}).catch(function (error) {
			console.log(error);
		})
	},

	mcUpdate: function(mcSubscriptionProperties) {
		mailchimp.patch('/lists/' + Meteor.settings.private.mailchimpListId + '/members/' + mcSubscriptionProperties.emailHash, {
			"email_address": mcSubscriptionProperties.email,
			"merge_fields": {
				"FNAME": mcSubscriptionProperties.firstName,
				"LNAME": mcSubscriptionProperties.lastName
			}
		}).catch(function (error) {
			console.log(error);
		})
	}
});