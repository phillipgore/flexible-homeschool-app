import { Template } from 'meteor/templating';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
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

	selectedSchoolYearId: function() {
		return FlowRouter.getParam('selectedSchoolYearId');
	},

	selectedSchoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')})
	},
	


	// School Year Totals
	termsCount: function() {
		return Terms.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}).count();
	},
	
	subjectsCount: function() {
		return Subjects.find().count();
	},

	weeksCount: function() {
		return Weeks.find().count()
	},

	lessonsCount: function() {
		return Lessons.find().count();
	},



	// School Year Progress and Percentages
	yearsProgress: function() {
		let lessonsTotal = Lessons.find().count();
		let lessonsCompletedTotal = Lessons.find({completed: true}).count();
		let percentComplete = lessonsCompletedTotal / lessonsTotal * 100;
		
		if (percentComplete > 0 && percentComplete < 1) {
			return 1;
		}
		return Math.floor(percentComplete);
	},

	yearsProgressStatus: function() {
		let lessonsIncompleteTotal = Lessons.find({completed: false}).count();

		if (!lessonsIncompleteTotal) {
			return 'meter-progress-primary';
		}
		return false;
	},

	yearsTotalTime: function() {
		let lessonCompletionTimes = Lessons.find({completed: true}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
		let minutes = _.sum(lessonCompletionTimes);
		return minutesConvert(minutes);
	},

	yearsAverageLessons: function() {
		let lessonsTotal = Lessons.find().count();
		let lessonCompletionTimes = Lessons.find({completed: true}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
		let minutes = _.sum(lessonCompletionTimes) / lessonsTotal;
		return minutesConvert(minutes);
	},

	yearsAverageWeeks: function() {
		let lessonCompletionTimes = Lessons.find({completed: true}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
		let weeksTotal = Weeks.find().count();
		let minutes = _.sum(lessonCompletionTimes) / weeksTotal;
		return minutesConvert(minutes);
	},

	yearsAverageTerms: function() {
		let lessonCompletionTimes = Lessons.find({completed: true}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
		let termsTotal = Terms.find().count();
		let minutes = _.sum(lessonCompletionTimes) / termsTotal;
		return minutesConvert(minutes);
	},
});










