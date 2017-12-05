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

	archiveSchoolYear: function(schoolYearId) {
		SchoolYears.update(schoolYearId, {$set: {archive: true}});
	}
})