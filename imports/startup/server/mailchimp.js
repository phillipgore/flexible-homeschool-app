import Mailchimp from 'mailchimp-api-v3';
const mailchimp = new Mailchimp(Meteor.settings.private.mailchimp);


Meteor.methods({
	mailChimpSubscriptions: function(subscriptionProperties) {
		console.log(subscriptionProperties);
		mailchimp.post('/lists/' + Meteor.settings.private.mailchimpListId + '/members', {
			"email_address": subscriptionProperties.email,
			"status": "subscribed",
			"merge_fields": {
				"FNAME": subscriptionProperties.firstName,
				"LNAME": subscriptionProperties.lastName
			}
		}).then((subscription) => {
			mailchimp.post('/lists/' + Meteor.settings.private.mailchimpListId + '/segments/' + Meteor.settings.private.mailchimpSegmentId + '/members', {
				"email_address": subscription.email_address
			});
		}).catch(function (error) {
			console.log(error);
		})
	},
});