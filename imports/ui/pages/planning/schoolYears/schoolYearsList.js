import {Template} from 'meteor/templating';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import './schoolYearsList.html';

Template.schoolYearsList.onCreated( function() {
	// Subscriptions
	this.subscribe('allSchoolYears');
});

Template.schoolYearsList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '/planning/list',
		leftIcon: 'fss-back',
		label: 'School Years',
		rightUrl: '/planning/schoolyears/new',
		rightIcon: 'fss-new',
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