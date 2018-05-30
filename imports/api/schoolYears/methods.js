import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {SchoolYears} from './schoolYears.js';
import {Subjects} from '../subjects/subjects.js';
import {Terms} from '../terms/terms.js';
import {Weeks} from '../weeks/weeks.js';
import {Lessons} from '../lessons/lessons.js';

Meteor.methods({
	insertSchoolYear(schoolYearProperties) {
		const schoolYearId = SchoolYears.insert(schoolYearProperties);
		return schoolYearId;
	},

	updateSchoolYear: function(schoolYearId, schoolYearProperties) {
		SchoolYears.update(schoolYearId, {$set: schoolYearProperties});
	},

	deleteSchoolYear: function(schoolYearId) {
		let subjectIds = Subjects.find({schoolYearId: schoolYearId}).map(subject => (subject._id))
		let termIds = Terms.find({schoolYearId: schoolYearId}).map(term => (term._id));
		let weekIds = Weeks.find({termId: {$in: termIds}}).map(week => (week._id));
		let lessonIds = Lessons.find({weekId: {$in: weekIds}}).map(lesson => (lesson._id));

		SchoolYears.update(schoolYearId, {$set: {deletedOn: new Date()}});
		subjectIds.forEach(function(subjectId) {
			Subjects.update(subjectId, {$set: {deletedOn: new Date()}});
		});
		termIds.forEach(function(termId) {
			Terms.update(termId, {$set: {deletedOn: new Date()}});
		});
		weekIds.forEach(function(weekId) {
			Weeks.update(weekId, {$set: {deletedOn: new Date()}});
		});
		lessonIds.forEach(function(lessonId) {
			Lessons.update(lessonId, {$set: {deletedOn: new Date()}});
		});
	}
})