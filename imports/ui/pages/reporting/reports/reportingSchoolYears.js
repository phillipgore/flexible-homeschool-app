import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Reports } from '../../../../api/reports/reports.js';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import { SchoolWork } from '../../../../api/schoolWork/schoolWork.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Weeks } from '../../../../api/weeks/weeks.js';
import { Lessons } from '../../../../api/lessons/lessons.js';

import {minutesConvert} from '../../../../modules/functions';
import _ from 'lodash'
import './reportingSchoolYears.html';

Template.reportingSchoolYears.helpers({
	user: function() {
		return Meteor.users.findOne();
	},

	report: function() {
		return Reports.findOne({_id: FlowRouter.getParam('selectedReportId')})
	},

	schoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')});
	},

	rowVisible: function() {
		let report = Reports.findOne({_id: FlowRouter.getParam('selectedReportId')});
		if (!report.schoolYearStatsVisible && !report.schoolYearCompletedVisible && !report.schoolYearTimesVisible) {
			return 'dis-tn-none';
		}
		return false;
	},

	thColSpan: function(number) {
		let report = Reports.findOne({_id: FlowRouter.getParam('selectedReportId')});
		let colCount = [report.schoolYearStatsVisible, report.schoolYearCompletedVisible, report.schoolYearTimesVisible].filter(count => count).length;
		if (colCount === 3 && number === 1) return 1
		if (colCount === 3 && number === 2) return 2
	},

	tdColSpan: function() {
		let report = Reports.findOne({_id: FlowRouter.getParam('selectedReportId')});
		let colCount = [report.schoolYearStatsVisible, report.schoolYearCompletedVisible, report.schoolYearTimesVisible].filter(count => count).length;
		if (colCount === 1) return 2
		if (colCount === 3) return 1
	}
});










