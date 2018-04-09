import {Template} from 'meteor/templating';
import {Groups} from '../../api/groups/groups.js';
import {SchoolYears} from '../../../api/schoolYears/schoolYears.js';
import {Students} from '../../../api/students/students.js';
import './navbar.html';

Template.navbar.onCreated( function() {
	// Subscriptions
	this.subscribe('basicStudents');
	this.subscribe('basicSchoolYears');

	if (!Session.set('selectedSchoolYearId')) {
		Session.set('selectedSchoolYearId', FlowRouter.getParam('selectedSchoolYearId'))
	}

	if (!Session.set('selectedStudentId')) {
		Session.set('selectedStudentId', FlowRouter.getParam('selectedStudentId'));
	}

	let template = Template.instance();

	template.autorun( () => {
		template.subscribe('basicSchoolYears', () => {
			if (!Session.get('selectedSchoolYear')) {
				let year = moment().year();
				let month = moment().month();
				function startYear(year) {
					if (month < 6) {
						return year = (year - 1).toString();
					}
					return year.toString();
				}
				
				if (SchoolYears.findOne({startYear: { $gte: startYear(moment().year())}}, {sort: {starYear: 1}})) {
		    		Session.set('selectedSchoolYear', SchoolYears.findOne({startYear: { $gte: startYear(moment().year())}}, {sort: {starYear: 1}}));
				} else {
					Session.set('selectedSchoolYear', SchoolYears.findOne({startYear: { $lte: startYear(moment().year())}}, {sort: {starYear: 1}}));
				}
			}
	    })
	});

	template.autorun( () => {
		template.subscribe('allStudents', () => {
			if (!Session.get('selectedStudent')) {
	    		Session.set('selectedStudent', Students.findOne({}, {sort: {birthday: 1, lastName: 1, firstName: 1}}));
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