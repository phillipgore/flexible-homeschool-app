import {Template} from 'meteor/templating';
import './reportingEach.html';

import _ from 'lodash'

Template.reportingEach.onRendered( function() {
	let resourcesScrollTop = document.getElementById(FlowRouter.getParam('selectedReportId')).getBoundingClientRect().top - 130;
	if (window.screen.availWidth > 640) {
		Session.set('resourcesScrollTop', resourcesScrollTop);
		document.getElementsByClassName('frame-one')[0].scrollTop = resourcesScrollTop;
	}
});

Template.reportingEach.helpers({
	selectedStudentId: function() {
		return Session.get('selectedStudentId');
	},

	selectedSchoolYearId: function() {
		return Session.get('selectedSchoolYearId');
	},

	selectedReportingTermId: function() {
		return Session.get('selectedReportingTermId');
	},

	selectedReportingWeekId: function() {
		return Session.get('selectedReportingWeekId');
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedReportId') === id) {
			return true;
		}
		return false;
	}
});