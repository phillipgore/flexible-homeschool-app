import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Reports } from '../../../../api/reports/reports.js';
import { SchoolWork } from '../../../../api/schoolWork/schoolWork.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Weeks } from '../../../../api/weeks/weeks.js';
import { Lessons } from '../../../../api/lessons/lessons.js';

import {minutesConvert} from '../../../../modules/functions';
import _ from 'lodash'
import './reportingTerms.html';

Template.reportingTerms.helpers({
	user: function() {
		return Meteor.users.findOne();
	},

	report: function() {
		return Reports.findOne({_id: FlowRouter.getParam('selectedReportId')})
	},

	terms: function() {
		if (FlowRouter.getParam('selectedTermId') === 'allTerms') {
			return Terms.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId'), _id: {$ne: 'allTerms'}});
		} else {
			return Terms.find({_id: FlowRouter.getParam('selectedTermId')});
		}
	},

	thColSpan: function(number) {
		let report = Reports.findOne({_id: FlowRouter.getParam('selectedReportId')});
		let colCount = [report.termsStatsVisible, report.termsCompletedVisible, report.termsTimesVisible].filter(count => count).length;
		if (colCount === 3 && number === 1) return 1
		if (colCount === 3 && number === 2) return 2
	},

	tdColSpan: function() {
		let report = Reports.findOne({_id: FlowRouter.getParam('selectedReportId')});
		let colCount = [report.termsStatsVisible, report.termsCompletedVisible, report.termsTimesVisible].filter(count => count).length;
		if (colCount === 1) return 2
		if (colCount === 3) return 1
	}
});










