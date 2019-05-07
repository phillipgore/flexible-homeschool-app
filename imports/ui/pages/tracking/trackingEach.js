import {Template} from 'meteor/templating';
import { Stats } from '../../../api/stats/stats.js';
import './trackingEach.html';

import _ from 'lodash'

Template.trackingEach.onRendered( function() {
	let resourcesScrollTop = document.getElementById(FlowRouter.getParam('selectedStudentId')).getBoundingClientRect().top - 130;
	if (window.screen.availWidth > 640) {
		Session.set('resourcesScrollTop', resourcesScrollTop);
		document.getElementsByClassName('frame-one')[0].scrollTop = resourcesScrollTop;
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
		return Stats.findOne({studentId: studentId, type: 'schoolYear'}) && Stats.findOne({studentId: studentId, type: 'schoolYear'}).completedLessonPercentage;
	},

	yearsProgressStatus: function(studentId) {
		let yearProgress = Stats.findOne({studentId: studentId, type: 'schoolYear'}) && Stats.findOne({studentId: studentId, type: 'schoolYear'}).completedLessonPercentage;;
		return 'width-' + yearProgress;
	},

	termsProgress: function(studentId) {
		return Stats.findOne({studentId: studentId, type: 'term'}) && Stats.findOne({studentId: studentId, type: 'term'}).completedLessonPercentage;
	},

	termsProgressStatus: function(studentId) {
		let termProgress = Stats.findOne({studentId: studentId, type: 'term'}) && Stats.findOne({studentId: studentId, type: 'term'}).completedLessonPercentage;
		return 'width-' + termProgress;
	},

	weeksProgress: function(studentId) {
		return Stats.findOne({studentId: studentId, type: 'week'}) && Stats.findOne({studentId: studentId, type: 'week'}).completedLessonPercentage;
	},

	weeksProgressStatus: function(studentId) {
		let weekProgress = Stats.findOne({studentId: studentId, type: 'week'}) && Stats.findOne({studentId: studentId, type: 'week'}).completedLessonPercentage;
		return 'width-' + weekProgress;
	},

	// progressStats: function(studentId) {
	// 	return _.find(Session.get('progressStats'), ['studentId', studentId]);
	// },

	active: function(id) {
		if (FlowRouter.getParam('selectedStudentId') === id) {
			return true;
		}
		return false;
	},
});