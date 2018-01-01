import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Subjects} from './subjects.js';

Meteor.methods({
	insertSubject(subjectProperties) {
		const subjectId = Subjects.insert(subjectProperties);
		return subjectId;
	},

	updateSubject: function(subjectId, subjectProperties) {
		Subjects.update(subjectId, {$set: subjectProperties});
	},

	deleteSubject: function(subjectId) {
		Subjects.update(subjectId, {$set: {deleted: true}});
	}
})