import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Reports } from '../../../api/reports/reports.js';
import './reportingList.html';

Template.reportingList.onCreated( function() {	
	this.subscribe('allReports');
});

Template.reportingList.onRendered( function() {
	Session.set({
		labelOne: 'Reports',
		newUrl: '/reporting/new/2',
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

	selectedReportingTermId: function() {
		return Session.get('selectedReportingTermId');
	},

	selectedReportingWeekId: function() {
		return Session.get('selectedReportingWeekId');
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