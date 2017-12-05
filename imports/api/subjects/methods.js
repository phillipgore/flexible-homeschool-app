import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Subjects} from './subjects.js';

Meteor.methods({
	insertSubject(subjectProperties) {
		Subjects.insert(subjectProperties);
	},

	updateSubject: function(subjectId, subjectProperties) {
		Subjects.update(subjectId, {$set: subjectProperties});
	},

	archiveSubject: function(subjectId) {
		Subjects.update(subjectId, {$set: {archive: true}});
	}
})