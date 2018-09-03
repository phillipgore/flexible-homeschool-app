import {Template} from 'meteor/templating';
import './officeDashboard.html';

Template.officeDashboard.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		this.accountData = Meteor.subscribe('allAccountTotals')
	});
});

Template.officeDashboard.onRendered( function() {
	Session.set({
		labelOne: 'Dashboard',
	});
});

Template.officeDashboard.helpers({
	subscriptionReady: function() {
		return Template.instance().accountData.ready();
	},
})