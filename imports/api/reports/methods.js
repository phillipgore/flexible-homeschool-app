import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Reports} from './reports.js';

Meteor.methods({
	insertReport(reportProperties) {
		const reportId = Reports.insert(reportProperties);
		return reportId;
	},

	updateReport: function(reportId, reportProperties) {
		Reports.update(reportId, {$set: reportProperties});
	},

	deleteReport: function(reportId) {
		Reports.remove({_id: reportId});
	},
})