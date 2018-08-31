import {Template} from 'meteor/templating';
import {Groups} from '../../groups/groups.js'
import './officeAccountsList.html';

Template.officeAccountsList.onCreated( function() {
	// Subscriptions
	this.subscribe('allAccounts');
});

Template.officeAccountsList.helpers({
	groups: function() {
		return Groups.find({appAdmin: false});
	},
});