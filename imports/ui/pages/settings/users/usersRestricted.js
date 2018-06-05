import {Template} from 'meteor/templating';
import './usersRestricted.html';

Template.usersRestricted.onRendered( function() {
	// ToolbarView Settings
	Session.set({
		labelOne: '',
		labelTwo: '',
		labelThree: '',
		activeNav: '',
	});
});

Template.usersRestricted.helpers({
	user: function() {
		return Meteor.users.findOne();
	},
});