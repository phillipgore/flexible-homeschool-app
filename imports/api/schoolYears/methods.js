import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {SchoolYears} from './schoolYears.js';

Meteor.methods({
	insertSchoolYear(schoolYearProperties) {
		const schoolYearId = SchoolYears.insert(schoolYearProperties);
		return schoolYearId;
	},

	updateSchoolYear: function(schoolYearId, schoolYearProperties) {
		SchoolYears.update(schoolYearId, {$set: schoolYearProperties});
	},

	deleteSchoolYear: function(schoolYearId) {
		SchoolYears.update(schoolYearId, {$set: {deleted: true}});
	}
})