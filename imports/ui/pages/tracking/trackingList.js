import {Template} from 'meteor/templating';
import { Students } from '../../../api/students/students.js';
import { SchoolYears } from '../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../api/terms/terms.js';
import './trackingList.html';

import _ from 'lodash'

ProgressStats = new Mongo.Collection('progressStats');

Template.trackingList.onCreated( function() {
	let template = Template.instance();

	this.trackingData = Meteor.subscribe('trackingListPub');
	this.progressData = Meteor.subscribe('progressStats', FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedTermId'), FlowRouter.getParam('selectedWeekId'));
});

Template.trackingList.onRendered( function() {
	Session.set({
		labelOne: 'Tracking',
		activeNav: 'trackingList',
		selectedStudentId: FlowRouter.getParam('selectedStudentId'),
		toolbarType: 'tracking',
		editUrl: '',
		newUrl: '',
	});
});

Template.trackingList.helpers({
	subscriptionReady: function() {
		return Template.instance().trackingData.ready() && Template.instance().progressData.ready();
	},

	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
	},

	schoolYears: function() {
		return SchoolYears.find({}, {sort: {startYear: 1}});
	},

	terms: function() {
		return Terms.find({}, {sort: {order: 1}});
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

	yearsProgress: function(studentId) {
		return ProgressStats.findOne({_id: studentId}) && ProgressStats.findOne({_id: studentId}).yearProgress
	},

	yearsProgressStatus: function(studentId) {
		let yearProgress = ProgressStats.findOne({_id: studentId}) && ProgressStats.findOne({_id: studentId}).yearProgress;
		if (yearProgress === 100) {
			return 'meter-progress-primary width-' + yearProgress;
		}
		return 'width-' + yearProgress;
	},

	termsProgress: function(studentId) {
		return ProgressStats.findOne({_id: studentId}) && ProgressStats.findOne({_id: studentId}).termProgress;
	},

	termsProgressStatus: function(studentId) {
		let termProgress = ProgressStats.findOne({_id: studentId}) && ProgressStats.findOne({_id: studentId}).termProgress;
		if (termProgress === 100) {
			return 'meter-progress-primary width-' + termProgress;
		}
		return 'width-' + termProgress;
	},

	weeksProgress: function(studentId) {
		return ProgressStats.findOne({_id: studentId}) && ProgressStats.findOne({_id: studentId}).weekProgress;
	},

	weeksProgressStatus: function(studentId) {
		let weekProgress = ProgressStats.findOne({_id: studentId}) && ProgressStats.findOne({_id: studentId}).weekProgress;
		if (weekProgress === 100) {
			return 'meter-progress-primary width-' + weekProgress;
		}
		return 'width-' + weekProgress;
	},

	progressStats: function(studentId) {
		return ProgressStats.findOne({_id: studentId});
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedStudentId') === id) {
			return true;
		}
		return false;
	}

});









