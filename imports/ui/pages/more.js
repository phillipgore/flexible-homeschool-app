import {Template} from 'meteor/templating';
import './more.html';

Template.more.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		leftCaret: false,
		label: 'More',
		rightUrl: '',
		rightIcon: '',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'more');
});

Template.more.helpers({
	items: [
		{divider: false, classes: '', icon: 'fss-list-users', label: 'Users', url: '/users'},
		{divider: false, classes: '', icon: 'fss-list-billing', label: 'Billing', url: '/billing'},
		{divider: false, classes: '', icon: 'fss-list-support', label: 'Support', url: '/support'},
		{divider: true, classes: 'js-sign-out', icon: 'fss-list-signout', label: 'Sign Out', url: '#'},
	]
});

Template.more.events({
	'click .js-sign-out'(event) {
		event.preventDefault();
		Accounts.logout(function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-icn-danger',
					message: error.reason,
				});
			} else {
				FlowRouter.go("/sign-in");
			}
		});
	},
});