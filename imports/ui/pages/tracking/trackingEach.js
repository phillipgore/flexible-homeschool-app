import {Template} from 'meteor/templating';
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
		return _.find(Session.get('progressStats'), ['studentId', studentId]) && _.find(Session.get('progressStats'), ['studentId', studentId]).yearProgress;
	},

	yearsProgressStatus: function(studentId) {
		let yearProgress = _.find(Session.get('progressStats'), ['studentId', studentId]) && _.find(Session.get('progressStats'), ['studentId', studentId]).yearProgress;
		return 'width-' + yearProgress;
	},

	termsProgress: function(studentId) {
		return _.find(Session.get('progressStats'), ['studentId', studentId]) && _.find(Session.get('progressStats'), ['studentId', studentId]).termProgress;
	},

	termsProgressStatus: function(studentId) {
		let termProgress = _.find(Session.get('progressStats'), ['studentId', studentId]) && _.find(Session.get('progressStats'), ['studentId', studentId]).termProgress;
		return 'width-' + termProgress;
	},

	weeksProgress: function(studentId) {
		return _.find(Session.get('progressStats'), ['studentId', studentId]) && _.find(Session.get('progressStats'), ['studentId', studentId]).weekProgress;
	},

	weeksProgressStatus: function(studentId) {
		let weekProgress = _.find(Session.get('progressStats'), ['studentId', studentId]) && _.find(Session.get('progressStats'), ['studentId', studentId]).weekProgress;
		return 'width-' + weekProgress;
	},

	progressStats: function(studentId) {
		return _.find(Session.get('progressStats'), ['studentId', studentId]);
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedStudentId') === id) {
			return true;
		}
		return false;
	},
});