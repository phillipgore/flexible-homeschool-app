import {Template} from 'meteor/templating';
import './usersRestricted.html';

Template.usersRestricted.onRendered( function() {
	// ToolbarView Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		label: '',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', '');
});

Template.usersRestricted.helpers({
	user: function() {
		return Meteor.users.findOne();
	},
});