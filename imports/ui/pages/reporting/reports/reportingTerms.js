import { Template } from 'meteor/templating';
import { Subjects } from '../../../../api/subjects/subjects.js';
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

	// Selections
	selectedSchoolYear: function() {
		return Session.get('selectedSchoolYear');
	},

	selectedStudent: function() {
		return Session.get('selectedStudent');
	},

	terms: function(selectedSchoolYearId) {
		return Terms.find({schoolYearId: selectedSchoolYearId})
	},



	// Term Totals
	subjectsCountTerm: function(termId, selectedStudentId) {
		let weekIds = Weeks.find({termId: termId}).map(week => (week._id));
		let subjectIds = _.uniq( Lessons.find({weekId: {$in: weekIds}}).map(lesson => (lesson.subjectId)) );
		return Subjects.find({_id: {$in: subjectIds}, studentId: selectedStudentId}).count()
	},

	weeksCountTerm: function(termId, selectedSchoolYearId, selectedStudentId) {
		let subjectIds = Subjects.find({schoolYearId: selectedSchoolYearId,studentId: selectedStudentId}).map(subject => (subject._id));
		let weekIds = Lessons.find({subjectId: {$in: subjectIds}}).map(lesson => (lesson.weekId));
		return Weeks.find({_id: {$in: weekIds}, termId: termId}).count();
	},

	lessonsCountTerm: function(termId, selectedSchoolYearId, selectedStudentId) {
		let subjectIds = Subjects.find({schoolYearId: selectedSchoolYearId, studentId: selectedStudentId}).map(subject => (subject._id));
		let weekIds = Weeks.find({termId: termId}).map(week => (week._id))
		return Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weekIds}}).count();
	},



	// Term Progress and Percentages
	termsProgress: function(selectedStudentId, selectedSchoolYearId, termId) {
		let subjectIds = Subjects.find({studentId: selectedStudentId, schoolYearId: selectedSchoolYearId}).map(subject => (subject._id));
		let weeksIds = Weeks.find({termId: termId}).map(week => (week._id))
		let lessonsTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weeksIds}}).count();
		let lessonsCompletedTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weeksIds}, completed: true}).count();
		let percentComplete = lessonsCompletedTotal / lessonsTotal * 100;

		if (percentComplete > 0 && percentComplete < 1) {
			return 1;
		}
		return Math.floor(percentComplete);
	},

	termsProgressStatus: function(selectedStudentId, selectedSchoolYearId, termId) {
		let subjectIds = Subjects.find({studentId: selectedStudentId, schoolYearId: selectedSchoolYearId}).map(subject => (subject._id));
		let weeksIds = Weeks.find({termId: termId}).map(week => (week._id))
		let lessonsIncompleteTotal = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weeksIds}, completed: false}).count();

		if (!lessonsIncompleteTotal) {
			return 'meter-progress-primary';
		}
		return false;
	},

	termsTotalTime: function(selectedStudentId, selectedSchoolYearId, termId) {
		let subjectIds = Subjects.find({studentId: selectedStudentId, schoolYearId: selectedSchoolYearId}).map(subject => (subject._id));
		let weeksIds = Weeks.find({termId: termId}).map(week => (week._id))
		let lessonCompletionTimes = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weeksIds}}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
		let minutes = _.sum(lessonCompletionTimes);
		return minutesConvert(minutes);
	},

	termsAverageLessons: function(selectedStudentId, selectedSchoolYearId, termId) {
		let subjectIds = Subjects.find({studentId: selectedStudentId, schoolYearId: selectedSchoolYearId}).map(subject => (subject._id));
		let weeksIds = Weeks.find({termId: termId}).map(week => (week._id))
		let lessonCompletionTimes = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weeksIds}}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
		let minutes = _.sum(lessonCompletionTimes) / lessonCompletionTimes.length;
		return minutesConvert(minutes);
	},

	termsAverageWeeks: function(selectedStudentId, selectedSchoolYearId, termId) {
		let subjectIds = Subjects.find({studentId: selectedStudentId, schoolYearId: selectedSchoolYearId}).map(subject => (subject._id));
		let weeksIds = Weeks.find({termId: termId}).map(week => (week._id));
		let lessonCompletionTimes = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weeksIds}}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));		
		let completedWeekIds = Lessons.find({subjectId: {$in: subjectIds}, weekId: {$in: weeksIds}, completed: true}).map(lesson => (lesson.weekId));
		let weeksTotal = Weeks.find({_id: {$in: completedWeekIds}}).count()

		let minutes = _.sum(lessonCompletionTimes) / weeksTotal;
		return minutesConvert(minutes);
	},
});










