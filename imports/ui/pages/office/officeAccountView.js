import {Template} from 'meteor/templating';
import {Groups} from '../../../api/groups/groups.js';
import './officeAccountView.html';

Template.officeAccountView.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		this.accountData = Meteor.subscribe('account', FlowRouter.getParam('selectedAccountId'));
		this.accountTotals = Meteor.subscribe('accountTotals', FlowRouter.getParam('selectedAccountId'))
	});

	Meteor.call('getAccountStats', FlowRouter.getParam('selectedAccountId'), function(error, result) {
		Session.set('accountStats', result);
	});
});

Template.officeAccountView.onRendered( function() {
	
});

Template.officeAccountView.helpers({
	subscriptionReady: function() {
		if (Template.instance().accountData.ready() && Template.instance().accountTotals.ready()) {
			return true;
		}
		return false;
	},

	account: function() {
		return Groups.findOne({_id: FlowRouter.getParam('selectedAccountId')});
	},

	accountUsers: function() {
		return Meteor.users.find({'info.groupId': FlowRouter.getParam('selectedAccountId')});
	},

	accountStats: function() {
		return Session.get('accountStats');
	},

	userName(first, last) {
		if (first && last) {
			Session.set({labelTwo: first + ' ' + last});
		}
		return false;
	},

	isPending(status) {
		if (status === 'pausePending') {
			return 'Pause Pending';
		}
		return status;
	}
});