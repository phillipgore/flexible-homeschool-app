import { Template } from 'meteor/templating';
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

	selectedSchoolYearId: function() {
		return FlowRouter.getParam('selectedSchoolYearId');
	},

	selectedSchoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')})
	},

	schoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')});
	},
});










