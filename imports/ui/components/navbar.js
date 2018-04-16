import {Template} from 'meteor/templating';
import {Groups} from '../../api/groups/groups.js';
import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {Students} from '../../api/students/students.js';
import moment from 'moment';
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

	selectedSchoolYearId: function() {
		return Session.get('selectedSchoolYearId');
	},

	selectedStudentId: function() {
		return Session.get('selectedStudentId');
	},

	selectedTermId: function() {
		return Session.get('selectedTermId');
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