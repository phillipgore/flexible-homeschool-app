import { Template } from "meteor/templating";
import "./officeDashboard.html";

Template.officeDashboard.onCreated(function()  {
	const template = Template.instance();

	template.autorun(() => {
		this.accountData = Meteor.subscribe('allAccountTotals');
	});

	Meteor.call('getInitialGroupIds', function(error, result) {
		Session.set('initialGroupIds', result)
	});
});

Template.officeDashboard.onRendered(() => {
	Session.set({
		labelOne: "Dashboard"
	});
});

Template.officeDashboard.helpers({
	getInitialGroupId: function(status) {
		console.log(Session.get('initialGroupIds'))
		return Session.get('initialGroupIds')[status];
	},
	
	subscriptionReady() {
		return Template.instance().accountData.ready();
	},
});
