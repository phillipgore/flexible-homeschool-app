import {Template} from 'meteor/templating';
import {Groups} from '../../../api/groups/groups.js';
import './officeAccountView.html';

Template.officeAccountView.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		this.subscribe('account', FlowRouter.getParam('selectedAccountId'));
	});
});

Template.officeAccountView.onRendered( function() {
	
});

Template.officeAccountView.helpers({
	account: function() {
		return Groups.findOne({_id: FlowRouter.getParam('selectedAccountId')});
	},

	accountUsers: function() {
		return Meteor.users.find({'info.groupId': FlowRouter.getParam('selectedAccountId')});
	},

	userName(first, last) {
		if (first && last) {
			Session.set({labelTwo: first + ' ' + last});
		}
		return false;
	},
});