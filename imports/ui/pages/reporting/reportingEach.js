import {Template} from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Reports } from '../../../api/reports/reports.js';
import './reportingEach.html';

import _ from 'lodash'

Template.reportingEach.onCreated( function() {
	Session.setPersistent('unScrolled', true);
});

Template.reportingEach.onRendered( function() {

});

Template.reportingEach.helpers({
	scroll: function() {
		if (Session.get('unScrolled') && Reports.find({_id: FlowRouter.getParam('selectedResourceId')}).count()) {
			setTimeout(function() {
				let newScrollTop = document.getElementById(FlowRouter.getParam('selectedResourceId')).getBoundingClientRect().top - 130;
				if (window.screen.availWidth > 640) {
					document.getElementsByClassName('frame-two')[0].scrollTop = newScrollTop;
				}
				Session.setPersistent('unScrolled', false);
				return false;
			}, 100);
		}
	},
	
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