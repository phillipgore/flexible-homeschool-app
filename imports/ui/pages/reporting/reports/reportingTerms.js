import { Template } from 'meteor/templating';
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
		return Terms.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId')});
	},
});










