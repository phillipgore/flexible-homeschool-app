import {Template} from 'meteor/templating';
import {Groups} from '../../api/groups/groups.js';
import {SchoolYears} from '../../api/schoolYears/schoolYears.js';
import {Students} from '../../api/students/students.js';
import moment from 'moment';
import './navbar.html';

Template.navbar.onCreated( function() {
	// Subscriptions
	let template = Template.instance();

	template.autorun( () => {
		template.subscribe('basicSchoolYears', () => {
			if (!Session.get('selectedSchoolYearId')) {
				let year = moment().year();
				let month = moment().month();
				function startYear(year) {
					if (month < 6) {
						return year = (year - 1).toString();
					}
					return year.toString();
				}
				
				if (SchoolYears.findOne({startYear: { $gte: startYear(moment().year())}}, {sort: {starYear: 1}})) {
		    		Session.set('selectedSchoolYearId', SchoolYears.findOne({startYear: { $gte: startYear(moment().year())}}, {sort: {starYear: 1}})._id);
				} else {
					Session.set('selectedSchoolYearId', SchoolYears.findOne({startYear: { $lte: startYear(moment().year())}}, {sort: {starYear: 1}})._id);
				}
			}
	    })
	});

	template.autorun( () => {
		template.subscribe('allStudents', () => {
			if (!Session.get('selectedStudentId')) {
	    		Session.set('selectedStudentId', Students.findOne({}, {sort: {birthday: 1, lastName: 1, firstName: 1}})._id);
	    	}
	    })
	});
});

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