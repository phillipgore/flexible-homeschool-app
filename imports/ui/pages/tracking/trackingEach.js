import {Template} from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
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
	selectedSchoolYearId: function() {
		return FlowRouter.getParam('selectedSchoolYearId');
	},

	selectedTermId: function() {
		return FlowRouter.getParam('selectedTermId');
	},

	selectedWeekId: function() {
		return FlowRouter.getParam('selectedWeekId');
	},

	yearsProgress: function(studentId) {
		return Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedSchoolYearId')}) && Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedSchoolYearId')}).completedLessonPercentage;
	},

	yearsProgressStatus: function(studentId) {
		let yearProgress = Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedSchoolYearId')}) && Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedSchoolYearId')}).completedLessonPercentage;;
		return 'width-' + yearProgress;
	},

	termsProgress: function(studentId) {
		return Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedTermId')}) && Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedTermId')}).completedLessonPercentage;
	},

	termsProgressStatus: function(studentId) {
		let termProgress = Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedTermId')}) && Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedTermId')}).completedLessonPercentage;
		return 'width-' + termProgress;
	},

	weeksProgress: function(studentId) {
		return Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedWeekId')}) && Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedWeekId')}).completedLessonPercentage;
	},

	weeksProgressStatus: function(studentId) {
		let weekProgress = Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedWeekId')}) && Stats.findOne({studentId: studentId, timeFrameId: FlowRouter.getParam('selectedWeekId')}).completedLessonPercentage;
		return 'width-' + weekProgress;
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedStudentId') === id) {
			return true;
		}
		return false;
	},
});