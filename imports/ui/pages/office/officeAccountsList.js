import {Template} from 'meteor/templating';
import './officeAccountsList.html';

Template.officeAccountsList.onCreated( function() {
	// Subscriptions
	this.subscribe('allAccounts');
});

Template.officeAccountsList.helpers({
	accounts: function() {
		return Meteor.users.find({'info.role': 'Administrator'}, {sort: {'info.lastName': 1, 'info.firstName': 1}});
	},
});