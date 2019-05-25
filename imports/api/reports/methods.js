import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Reports} from './reports.js';
import {reportsInitialId} from '../../modules/server/initialIds';

Meteor.methods({
	insertReport(reportProperties) {
		const reportId = Reports.insert(reportProperties);
		reportsInitialId();
		return reportId;
	},

	updateReport: function(reportId, reportProperties) {
		Reports.update(reportId, {$set: reportProperties});
		reportsInitialId();
	},

	deleteReport: function(reportId) {
		Reports.remove({_id: reportId});
		reportsInitialId();
	},
})