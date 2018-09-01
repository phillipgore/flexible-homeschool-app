import {Template} from 'meteor/templating';
import {Groups} from '../../../api/groups/groups.js';
import './officeAccountView.html';

Template.officeAccountView.onCreated( function() {
	// Subscriptions
	this.subscribe('account', FlowRouter.getParam('selectedAccountId'));
});

Template.officeAccountView.helpers({
	group: function() {
		return Groups.find({_id: FlowRouter.getParam('selectedAccountId')});
	},

	groupUsers: function() {
		return Meteor.users.find({'info.groupId': FlowRouter.getParam('selectedAccountId')})
	}
});