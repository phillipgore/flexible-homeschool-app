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

	terms: function() {
		return Terms.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId')})
	},



	// Term Totals
	subjectsCountTerm: function(termId) {
		let weekIds = Weeks.find({termId: termId}).map(week => (week._id));
		let subjectIds = _.uniq( Lessons.find({weekId: {$in: weekIds}}).map(lesson => (lesson.subjectId)) );
		return Subjects.find({_id: {$in: subjectIds}}).count()
	},

	weeksCountTerm: function(termId) {
		return Weeks.find({termId: termId}).count();
	},

	lessonsCountTerm: function(termId) {
		let weekIds = Weeks.find({termId: termId}).map(week => (week._id))
		return Lessons.find({weekId: {$in: weekIds}}).count();
	},



	// Term Progress and Percentages
	termsProgress: function(termId) {
		let weeksIds = Weeks.find({termId: termId}).map(week => (week._id))
		let lessonsTotal = Lessons.find({weekId: {$in: weeksIds}}).count();
		let lessonsCompletedTotal = Lessons.find({weekId: {$in: weeksIds}, completed: true}).count();
		let percentComplete = lessonsCompletedTotal / lessonsTotal * 100;

		if (percentComplete > 0 && percentComplete < 1) {
			return 1;
		}
		return Math.floor(percentComplete);
	},

	termsProgressStatus: function(termId) {
		let weeksIds = Weeks.find({termId: termId}).map(week => (week._id))
		let lessonsIncompleteTotal = Lessons.find({weekId: {$in: weeksIds}, completed: false}).count();

		if (!lessonsIncompleteTotal) {
			return 'meter-progress-primary';
		}
		return false;
	},

	termsTotalTime: function(termId) {
		let weeksIds = Weeks.find({termId: termId}).map(week => (week._id))
		let lessonCompletionTimes = Lessons.find({weekId: {$in: weeksIds}}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
		let minutes = _.sum(lessonCompletionTimes);
		return minutesConvert(minutes);
	},

	termsAverageLessons: function(termId) {
		let weeksIds = Weeks.find({termId: termId}).map(week => (week._id))
		let lessonCompletionTimes = Lessons.find({weekId: {$in: weeksIds}}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
		let minutes = _.sum(lessonCompletionTimes) / lessonCompletionTimes.length;
		return minutesConvert(minutes);
	},

	termsAverageWeeks: function(termId) {
		let weeksIds = Weeks.find({termId: termId}).map(week => (week._id));
		let lessonCompletionTimes = Lessons.find({weekId: {$in: weeksIds}}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));		
		let completedWeekIds = Lessons.find({weekId: {$in: weeksIds}, completed: true}).map(lesson => (lesson.weekId));
		let weeksTotal = Weeks.find({_id: {$in: completedWeekIds}}).count()

		let minutes = _.sum(lessonCompletionTimes) / weeksTotal;
		return minutesConvert(minutes);
	},
});










