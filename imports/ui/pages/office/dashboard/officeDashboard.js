import { Template } from "meteor/templating";
import "./officeDashboard.html";

Template.officeDashboard.onCreated(function()  {
	const template = Template.instance();

	template.autorun(() => {
		Meteor.call('getInitialGroupIds', function(error, result) {
			Session.set('initialGroupIds', result)
		});
		this.accountData = Meteor.subscribe('allAccountTotals');
	});
});

Template.officeDashboard.onRendered(() => {
	Session.set({
		labelOne: "Dashboard"
	});
});

Template.officeDashboard.helpers({
	getInitialGroupId: function(status) {
		return Session.get('initialGroupIds')[status] && Session.get('initialGroupIds')[status];
	},
	
	subscriptionReady() {
		return Template.instance().accountData.ready();
	},
});
