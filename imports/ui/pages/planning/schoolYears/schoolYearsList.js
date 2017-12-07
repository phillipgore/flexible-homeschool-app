import {Template} from 'meteor/templating';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import './schoolYearsList.html';

Template.schoolYearsList.onRendered( function() {
	// Subscriptions
	Meteor.subscribe('allSchoolYears');

	// Toolbar Settings
	Session.set({
		leftUrl: '/planning/list',
		leftIcon: 'fss-btn-back',
		leftCaret: false,
		label: 'School Years',
		rightUrl: '/planning/schoolyears/new',
		rightIcon: 'fss-btn-new',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.schoolYearsList.helpers({
	schoolYears: function() {
		return SchoolYears.find({}, {sort: {startYear: 1}});
	},
});

Template.schoolYearsList.events({
	
});