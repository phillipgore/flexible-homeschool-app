import { Template } from 'meteor/templating';
import { Subjects } from '../../../../api/subjects/subjects.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Weeks } from '../../../../api/weeks/weeks.js';
import { Lessons } from '../../../../api/lessons/lessons.js';
import { Resources } from '../../../../api/resources/resources.js';

import {minutesConvert} from '../../../../modules/functions';
import _ from 'lodash'
import './reportingLessons.html';

Template.reportingLessons.helpers({
	user: function() {
		return Meteor.users.findOne();
	},

	subjects: function(selectedSchoolYearId, selectedStudentId) {
		let subjectIds = Subjects.find({schoolYearId: selectedSchoolYearId, studentId: selectedStudentId}).map(subject => (subject._id));
		let updatedSubjectIds = _.uniq( Lessons.find({subjectId: {$in: subjectIds}, completed: true}).map(lesson => (lesson.subjectId)) );
		return Subjects.find({_id: {$in: updatedSubjectIds}})
	},




	// Selections
	selectedSchoolYear: function() {
		return Session.get('selectedSchoolYear');
	},

	selectedStudent: function() {
		return Session.get('selectedStudent');
	},



	// Subject Terms, Weeks and Lessons
	terms: function(subjectId) {
		let weekIds = _.uniq( Lessons.find({subjectId: subjectId, completed: true}).map(lesson => (lesson.weekId)) );
		let termIds = _.uniq( Weeks.find({_id: {$in: weekIds}}).map(week => (week.termId)) );
		return Terms.find({_id: {$in: termIds}});
	},

	weeks: function(subjectId) {
		let weekIds = _.uniq( Lessons.find({subjectId: subjectId, completed: true}).map(lesson => (lesson.weekId)) );
		return Weeks.find({_id: {$in: weekIds}});
	},

	lessons: function(weekId, subjectId) {
		return Lessons.find({weekId: weekId, subjectId: subjectId, completed: true}, {sort: {order: 1}});
	},

	lessonOrder: function(lessonOrder) {
		return lessonOrder + 1;
	},
});










