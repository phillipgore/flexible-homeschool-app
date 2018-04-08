import { Template } from 'meteor/templating';
import { Subjects } from '../../../../api/subjects/subjects.js';
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

	// Selections
	selectedSchoolYear: function() {
		return Session.get('selectedSchoolYear');
	},

	selectedStudent: function() {
		return Session.get('selectedStudent');
	},
	


	// School Year Totals
	termsCountSchoolYear: function(selectedSchoolYearId) {
		return Terms.find({schoolYearId: selectedSchoolYearId}).count();
	},
	
	subjectsCountSchoolYear: function(selectedSchoolYearId, selectedStudentId) {
		return Subjects.find({schoolYearId: selectedSchoolYearId, studentId: selectedStudentId}).count();
	},

	weeksCountSchoolYear: function(selectedSchoolYearId) {
		let termIds = Terms.find({schoolYearId: selectedSchoolYearId}).map(term => (term._id))
		return Weeks.find({termId: {$in: termIds}}).count()
	},

	lessonsCountSchoolYear: function(selectedSchoolYearId, selectedStudentId) {
		let subjectIds = Subjects.find({schoolYearId: selectedSchoolYearId, studentId: selectedStudentId}).map(subject => (subject._id))
		return Lessons.find({subjectId: {$in: subjectIds}}).count();
	},



	// School Year Progress and Percentages
	yearsProgress: function(selectedStudentId, selectedSchoolYearId) {
		let subjectIds = Subjects.find({studentId: selectedStudentId, schoolYearId: selectedSchoolYearId}).map(subject => (subject._id));
		let lessonsTotal = Lessons.find({subjectId: {$in: subjectIds}}).count();
		let lessonsCompletedTotal = Lessons.find({subjectId: {$in: subjectIds}, completed: true}).count();
		let percentComplete = lessonsCompletedTotal / lessonsTotal * 100;
		
		if (percentComplete > 0 && percentComplete < 1) {
			return 1;
		}
		return Math.floor(percentComplete);
	},

	yearsProgressStatus: function(selectedStudentId, selectedSchoolYearId) {
		let subjectIds = Subjects.find({studentId: selectedStudentId, schoolYearId: selectedSchoolYearId}).map(subject => (subject._id));
		let lessonsIncompleteTotal = Lessons.find({subjectId: {$in: subjectIds}, completed: false}).count();

		if (!lessonsIncompleteTotal) {
			return 'meter-progress-primary';
		}
		return false;
	},

	yearsTotalTime: function(selectedStudentId, selectedSchoolYearId) {
		let subjectIds = Subjects.find({studentId: selectedStudentId, schoolYearId: selectedSchoolYearId}).map(subject => (subject._id));
		let lessonCompletionTimes = Lessons.find({subjectId: {$in: subjectIds}}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
		let minutes = _.sum(lessonCompletionTimes);
		return minutesConvert(minutes);
	},

	yearsAverageLessons: function(selectedStudentId, selectedSchoolYearId) {
		let subjectIds = Subjects.find({studentId: selectedStudentId, schoolYearId: selectedSchoolYearId}).map(subject => (subject._id));
		let lessonCompletionTimes = Lessons.find({subjectId: {$in: subjectIds}}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
		let minutes = _.sum(lessonCompletionTimes) / lessonCompletionTimes.length;
		return minutesConvert(minutes);
	},

	yearsAverageWeeks: function(selectedStudentId, selectedSchoolYearId) {
		let subjectIds = Subjects.find({studentId: selectedStudentId, schoolYearId: selectedSchoolYearId}).map(subject => (subject._id));
		let lessonCompletionTimes = Lessons.find({subjectId: {$in: subjectIds}}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
		let weekIds = Lessons.find({subjectId: {$in: subjectIds}, completed: true}).map(lesson => (lesson.weekId));
		let weeksTotal = Weeks.find({_id: {$in: weekIds}}).count();
		let minutes = _.sum(lessonCompletionTimes) / weeksTotal;
		return minutesConvert(minutes);
	},

	yearsAverageTerms: function(selectedStudentId, selectedSchoolYearId) {
		let subjectIds = Subjects.find({studentId: selectedStudentId, schoolYearId: selectedSchoolYearId}).map(subject => (subject._id));
		let lessonCompletionTimes = Lessons.find({subjectId: {$in: subjectIds}}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
		let termsTotal = Terms.find({schoolYearId: selectedSchoolYearId}).count();
		let minutes = _.sum(lessonCompletionTimes) / termsTotal;
		return minutesConvert(minutes);
	},
});










