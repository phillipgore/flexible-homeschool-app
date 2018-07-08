import { Template } from 'meteor/templating';
import { Reports } from '../../../api/reports/reports.js';
import './reportingList.html';

Template.reportingList.onCreated( function() {
	this.subscribe('allReports');
});

Template.reportingList.onRendered( function() {
	Session.set({
		labelOne: 'Reports',
		newUrl: '/reporting/new/',
		activeNav: 'reportingList',
	});
});

Template.reportingList.helpers({
	reports: function() {
		return Reports.find({}, {sort: {name: 1}});
	},

	selectedStudentId: function() {
		return Session.get('selectedStudentId');
	},

	selectedSchoolYearId: function() {
		return Session.get('selectedSchoolYearId');
	},

	selectedReportId: function() {
		return Session.get('selectedReportId');
	},

	activeRoute: function(currentRoute, route) {
		if (currentRoute === route) {
			return true;
		}
		return false;
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedReportId') === id) {
			return true;
		}
		return false;
	}
});