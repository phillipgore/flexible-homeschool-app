import {Template} from 'meteor/templating';
import './settingsList.html';

Template.settingsList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		label: 'Settings',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'settingsList');
});

Template.settingsList.helpers({
	items: [
		{divider: false, classes: '', icon: 'fss-users', label: 'Users', url: '/users'},
		{divider: false, classes: '', icon: 'fss-billing', label: 'Billing', url: '/billing'},
		{divider: false, classes: '', icon: 'fss-support', label: 'Support', url: '/support'},
		{divider: true, classes: 'js-sign-out', icon: 'fss-signout', label: 'Sign Out', url: '#'},
	]
});

Template.settingsList.events({
	'click .js-sign-out'(event) {
		event.preventDefault();
		Accounts.logout(function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
			} else {
				FlowRouter.go("/sign-in");
			}
		});
	},
});