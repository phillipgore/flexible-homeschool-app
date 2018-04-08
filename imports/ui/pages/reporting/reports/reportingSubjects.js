import { Template } from 'meteor/templating';
import { Subjects } from '../../../../api/subjects/subjects.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Weeks } from '../../../../api/weeks/weeks.js';
import { Lessons } from '../../../../api/lessons/lessons.js';
import { Resources } from '../../../../api/resources/resources.js';

import {minutesConvert} from '../../../../modules/functions';
import _ from 'lodash'
import './reportingSubjects.html';

Template.reportingSubjects.helpers({
	user: function() {
		return Meteor.users.findOne();
	},

	subjects: function(selectedSchoolYearId, selectedStudentId) {
		return Subjects.find({schoolYearId: selectedSchoolYearId, studentId: selectedStudentId})
	},

	

	// Selections
	selectedSchoolYear: function() {
		return Session.get('selectedSchoolYear');
	},

	selectedStudent: function() {
		return Session.get('selectedStudent');
	},




	// School Year Totals
	termsCountSubject: function(subjectId, selectedSchoolYearId, selectedStudentId) {
		let weekIds = Lessons.find({subjectId: subjectId}).map(lesson => (lesson.weekId));
		return _.uniq( Weeks.find({_id: {$in: weekIds}}).map(week => (week.termId)) ).length;
	},

	subjectsAverageLessons: function(subjectId) {
		let lessonCompletionTimes = Lessons.find({subjectId: subjectId, completed: true}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
		let minutes = _.sum(lessonCompletionTimes) / lessonCompletionTimes.length;
		return minutesConvert(minutes);
	},

	weeksCountSubject: function(subjectId, selectedSchoolYearId, selectedStudentId) {
		return _.uniq( Lessons.find({subjectId: subjectId}).map(lesson => (lesson.weekId)) ).length;
	},

	lessonsCountSubject: function(subjectId) {
		return Lessons.find({subjectId: subjectId}).count();
	},




	// Subjects Progress and Percentages
	subjectsProgress: function(subjectId) {
		let lessonsTotal = Lessons.find({subjectId: subjectId}).count();
		let lessonsCompletedTotal = Lessons.find({subjectId: subjectId, completed: true}).count();
		let percentComplete = lessonsCompletedTotal / lessonsTotal * 100;

		if (percentComplete > 0 && percentComplete < 1) {
			return 1;
		}
		return Math.floor(percentComplete);
	},

	subjectsProgressStatus: function(subjectId) {
		let lessonsIncompleteTotal = Lessons.find({subjectId: subjectId, completed: false}).count();

		if (!lessonsIncompleteTotal) {
			return 'meter-progress-primary';
		}
		return false;
	},

	subjectsTotalTime: function(subjectId) {
		let lessonCompletionTimes = Lessons.find({subjectId: subjectId, completed: true}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
		let minutes = _.sum(lessonCompletionTimes);
		return minutesConvert(minutes);
	},

	subjectsAverageWeeks: function(subjectId) {
		let weeksTotal = _.uniq( Lessons.find({subjectId: subjectId, completed: true}).map(lesson => (lesson.weekId)) ).length;
		let lessonCompletionTimes = Lessons.find({subjectId: subjectId, completed: true}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
		let minutes = _.sum(lessonCompletionTimes) / weeksTotal;
		return minutesConvert(minutes); 
	},

	subjectsAverageTerms: function(subjectId) {
		let weekIds = _.uniq( Lessons.find({subjectId: subjectId, completed: true}).map(lesson => (lesson.weekId)) );
		let termsTotal = _.uniq( Weeks.find({_id: {$in: weekIds}}).map(week => (week.termId)) ).length;
		let lessonCompletionTimes = Lessons.find({subjectId: subjectId, completed: true}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
		let minutes = _.sum(lessonCompletionTimes) / termsTotal;
		return minutesConvert(minutes); 
	},

	lastSubject: function(index, subjectCount) {
		console.log((index + 1) +" "+ subjectCount)
		if (index + 1 === subjectCount) {
			return true;
		}
		return false;
	},



	// Subject Resources
	resources: function(resourceIds) {
		return Resources.find({_id: {$in: resourceIds}})
	},

	resourceIcon: function(resource) {
		if (resource === 'app') {
			return 'fss-app';
		}
		if (resource === 'audio') {
			return 'fss-audio';
		}
		if (resource === 'book') {
			return 'fss-book';
		}
		if (resource === 'link') {
			return 'fss-link';
		}
		if (resource === 'video') {
			return 'fss-video';
		}
	},
});










