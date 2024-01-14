import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Reports } from '../../../../api/reports/reports.js';
import { SchoolWork } from '../../../../api/schoolWork/schoolWork.js';
import { Notes } from '../../../../api/notes/notes.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Weeks } from '../../../../api/weeks/weeks.js';
import { Lessons } from '../../../../api/lessons/lessons.js';
import { Resources } from '../../../../api/resources/resources.js';

import {minutesConvert} from '../../../../modules/functions';
import _ from 'lodash'
import './reportingSchoolWork.html';

function getPercentComplete(completedTotal, total) {
	if (!completedTotal || !total) {
		return 0;
	} else {
		return completedTotal / total * 100;
	}
}

Template.reportingSchoolWork.helpers({
	report: function() {
		return Reports.findOne({_id: FlowRouter.getParam('selectedReportId')})
	},

	terms: function() {
		if (FlowRouter.getParam('selectedTermId') === 'allTerms') {
			return Terms.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId'), _id: {$ne: 'allTerms'}});
		} else {
			return Terms.find({_id: FlowRouter.getParam('selectedTermId')});
		}
	},

	termWeeks: function(termId) {
		if (FlowRouter.getParam('selectedWeekId') === 'allWeeks') {
			return Weeks.find({termId: termId, _id: {$ne: 'allWeeks'}});
		} else {
			return Weeks.find({$and: [{_id: FlowRouter.getParam('selectedWeekId')}, {_id: {$ne: 'allWeeks'}}]});
		}
	},

	progress: function(lessonData, schoolWorkId) {
		let lessons = _.filter(lessonData, ['schoolWorkId', schoolWorkId]);
		let lessonsTotal = lessons.length;
		let lessonsCompletedTotal = _.filter(lessons, ['completed', true]).length;
		let percentComplete = getPercentComplete(lessonsCompletedTotal, lessonsTotal);
		if (percentComplete > 0 && percentComplete < 1) {
			return 1;
		} else {
			return Math.floor(percentComplete);
		}
	},

	progressComplete: function(lessonData, schoolWorkId) {
		let lessons = _.filter(lessonData, ['schoolWorkId', schoolWorkId]);
		let lessonsTotal = lessons.length;
		let lessonsCompletedTotal = _.filter(lessons, ['completed', true]).length;
		let percentComplete = getPercentComplete(lessonsCompletedTotal, lessonsTotal);

		if (Math.floor(percentComplete) === 100) {
			return true;
		} else {
			return false;
		}
	},

	getNote: function(noteData, schoolWorkId) {
		let notes = _.find(noteData, ['schoolWorkId', schoolWorkId]);
		return notes ? notes.note : "";
	},

	schoolWorkLessons: function(lessonData, schoolWorkId) {
		return _.filter(lessonData, ['schoolWorkId', schoolWorkId]);
	},

	schoolWork: function() {
		return SchoolWork.find({studentId: FlowRouter.getParam('selectedStudentId'), schoolYearId: FlowRouter.getParam('selectedSchoolYearId')});
	},

	resourceIcon: function(resourceType) {
		if (resourceType === 'app') {
			return 'icn-app';
		}
		if (resourceType === 'audio') {
			return 'icn-audio';
		}
		if (resourceType === 'book') {
			return 'icn-book';
		}
		if (resourceType === 'link') {
			return 'icn-link';
		}
		if (resourceType === 'video') {
			return 'icn-video';
		}
	},

	resourceType: function(resourceType, type) {
		if (resourceType === type) {
			return true;
		}
		return false;
	},

	progressMeter: function(progress) {
		if (progress === 100) {
			return 'meter-progress-primary';
		}
		return false;
	},

	rowVisible: function(schoolWorkStatsVisible, schoolWorkTimesVisible) {
		if (!schoolWorkStatsVisible && !schoolWorkTimesVisible) {
			return 'dis-tn-none';
		}
		return false;
	},

	colSpan: function(schoolWorkStatsVisible, schoolWorkTimesVisible) {
		if (schoolWorkStatsVisible && schoolWorkTimesVisible) {
			return 1;
		}
		return 2;
	},

	isWeekDay: function(weekDay) {
		if (weekDay === '0' || weekDay === undefined) {
			return false;
		}
		return true;
	},
});










