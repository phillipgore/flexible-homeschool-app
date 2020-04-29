import {Template} from 'meteor/templating';
import {Groups} from '../../../../api/groups/groups.js';
import './officeAccountsList.html';

Template.officeAccountsList.onCreated( function() {
	let template = Template.instance();

	template.autorun(() => {
		this.allAccounts = Meteor.subscribe('allAccounts', FlowRouter.getParam('selectedStatusId'));
	});
});

Template.officeAccountsList.onRendered( function() {
	Session.set({
		labelOne: 'Accounts',
	});
});

Template.officeAccountsList.helpers({
	subscriptionReady: function() {
		if (Template.instance().allAccounts.ready()) {
			return true;
		}
		return false;
	},

	groups: function() {
		return Groups.find({}, {sort: {createdOn: -1}});
	},

	activeRoute: function(currentRoute, route) {
		if (currentRoute === route) {
			return true;
		}
		return false;
	},
});