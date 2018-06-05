import {Template} from 'meteor/templating';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import './schoolYearsList.html';

Template.schoolYearsList.onCreated( function() {
	// Subscriptions
	this.subscribe('allSchoolYears');
});

Template.schoolYearsList.onRendered( function() {
	Session.set({
		labelTwo: 'School Years',
		newUrl: '/planning/schoolyears/new/',
		activeNav: 'planningList',
	});
});

Template.schoolYearsList.helpers({
	schoolYears: function() {
		return SchoolYears.find({}, {sort: {startYear: 1}});
	},

	selectedSchoolYearId: function() {
		return FlowRouter.getParam('selectedSchoolYearId');
	},

	activeRoute: function(currentRoute, route) {
		if (currentRoute === route) {
			return true;
		}
		return false;
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedSchoolYearId') === id) {
			return true;
		}
		return false;
	}
});