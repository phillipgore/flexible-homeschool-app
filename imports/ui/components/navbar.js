import {Template} from 'meteor/templating';
import {Groups} from '../../api/groups/groups.js';
import './navbar.html';

Template.navbar.helpers({
	user: function() {
		return Meteor.users.findOne();
	},

	userRestricted: function(role) {
		if (role === 'Observer') {
			return true;
		}
		return false;
	},

	active(nav) {
		if (Session.get('activeNav') ===  nav) {
			return 'active';
		}
		return;
	},

	group: function() {
		return Groups.findOne({});
	},
});

Template.navbar.events({
	'click .js-navbar-restricted '(event) {
		let role = $(event.currentTarget).attr('data-role');
		let section = $(event.currentTarget).attr('data-section');
		Alerts.insert({
			colorClass: 'bg-info',
			iconClass: 'fss-info',
			message: 'The role of "' + role + '" is not allowed to access the ' + section + ' section.',
		});
	}
});