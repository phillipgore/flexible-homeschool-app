import {Template} from 'meteor/templating';
import { Stats } from '../../../api/stats/stats.js';
import './trackingEach.html';

import _ from 'lodash'

Template.trackingEach.onRendered( function() {
	let newScrollTop = document.getElementById(FlowRouter.getParam('selectedStudentId')).getBoundingClientRect().top - 130;
	if (window.screen.availWidth > 640) {
		document.getElementsByClassName('frame-one')[0].scrollTop = newScrollTop;
	}
});

Template.trackingEach.helpers({
	typeIsStudents: function(type) {
		if (type === 'students') {
			return true;
		}
		return false;
	},

	typeIsStudentGroups: function(type) {
		if (type === 'studentgroups') {
			return true;
		}
		return false;
	},

	selectedSchoolYearId: function() {
		return FlowRouter.getParam('selectedSchoolYearId');
	},

	selectedTermId: function() {
		return FlowRouter.getParam('selectedTermId');
	},

	selectedWeekId: function() {
		return FlowRouter.getParam('selectedWeekId');
	},


	// Student Stats
	yearsStudentProgress: function(studentId) {
		return Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedSchoolYearId')}) && Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedSchoolYearId')}).completedLessonPercentage;
	},

	yearsStudentProgressStatus: function(studentId) {
		let yearProgress = Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedSchoolYearId')}) && Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedSchoolYearId')}).completedLessonPercentage;;
		return 'width-' + yearProgress;
	},

	termsStudentProgress: function(studentId) {
		return Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedTermId')}) && Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedTermId')}).completedLessonPercentage;
	},

	termsStudentProgressStatus: function(studentId) {
		let termProgress = Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedTermId')}) && Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedTermId')}).completedLessonPercentage;
		return 'width-' + termProgress;
	},

	weeksStudentProgress: function(studentId) {
		return Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedWeekId')}) && Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedWeekId')}).completedLessonPercentage;
	},

	weeksStudentProgressStatus: function(studentId) {
		let weekProgress = Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedWeekId')}) && Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedWeekId')}).completedLessonPercentage;
		return 'width-' + weekProgress;
	},

	
	// Student Group Stats
	yearsStudentGroupProgress: function(studentGroupId) {
		return Stats.findOne({studentGroupId: studentGroupId, timeFrameId: FlowRouter.getParam('selectedSchoolYearId')}) && Stats.findOne({studentGroupId: studentGroupId, timeFrameId: FlowRouter.getParam('selectedSchoolYearId')}).completedLessonPercentage;
	},

	yearsStudentGroupProgressStatus: function(studentGroupId) {
		let yearProgress = Stats.findOne({studentGroupId: studentGroupId, timeFrameId: FlowRouter.getParam('selectedSchoolYearId')}) && Stats.findOne({studentGroupId: studentGroupId, timeFrameId: FlowRouter.getParam('selectedSchoolYearId')}).completedLessonPercentage;;
		return 'width-' + yearProgress;
	},

	termsStudentGroupProgress: function(studentGroupId) {
		return Stats.findOne({studentGroupId: studentGroupId, timeFrameId: FlowRouter.getParam('selectedTermId')}) && Stats.findOne({studentGroupId: studentGroupId, timeFrameId: FlowRouter.getParam('selectedTermId')}).completedLessonPercentage;
	},

	termsStudentGroupProgressStatus: function(studentGroupId) {
		let termProgress = Stats.findOne({studentGroupId: studentGroupId, timeFrameId: FlowRouter.getParam('selectedTermId')}) && Stats.findOne({studentGroupId: studentGroupId, timeFrameId: FlowRouter.getParam('selectedTermId')}).completedLessonPercentage;
		return 'width-' + termProgress;
	},

	weeksStudentGroupProgress: function(studentGroupId) {
		return Stats.findOne({studentGroupId: studentGroupId, timeFrameId: FlowRouter.getParam('selectedWeekId')}) && Stats.findOne({studentGroupId: studentGroupId, timeFrameId: FlowRouter.getParam('selectedWeekId')}).completedLessonPercentage;
	},

	weeksStudentGroupProgressStatus: function(studentGroupId) {
		let weekProgress = Stats.findOne({studentGroupId: studentGroupId, timeFrameId: FlowRouter.getParam('selectedWeekId')}) && Stats.findOne({studentGroupId: studentGroupId, timeFrameId: FlowRouter.getParam('selectedWeekId')}).completedLessonPercentage;
		return 'width-' + weekProgress;
	},


	activeStudent: function(id) {
		if (FlowRouter.getParam('selectedStudentId') === id) {
			return true;
		}
		return false;
	},

	activeStudentGroup: function(id) {
		if (FlowRouter.getParam('selectedStudentGroupId') === id) {
			return true;
		}
		return false;
	},
});