import {Groups} from '../../api/groups/groups.js';

import Mailchimp from 'mailchimp-api-v3';
import md5 from 'md5';

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
	},

	mcTags: function(groupId) {
		let tag = Groups.findOne({_id: groupId}).subscriptionStatus;

		Meteor.users.find({'info.groupId': groupId}).forEach(user => {
			let email = user.emails[0].address;
			let emailHash = md5(email);

			console.log('tag: ' + user.info.firstName +' '+ user.info.lastName +': '+ email +': '+ tag)

			mailchimp.post('/lists/' + Meteor.settings.private.mailchimpListId + '/members/' + emailHash + '/tags', {
				"tags": [{
					"name": tag,
					"status": "active",
				}]
			}).catch(function (error) {
				console.log(error);
			})
		})
	}
});