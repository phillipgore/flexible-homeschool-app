import {Template} from 'meteor/templating';
import { Students } from '../../../api/students/students.js';
import { Subjects } from '../../../api/subjects/subjects.js';
import { SchoolYears } from '../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../api/terms/terms.js';
import { Weeks } from '../../../api/weeks/weeks.js';
import { Lessons } from '../../../api/lessons/lessons.js';
import './trackingList.html';

StudentStats = new Mongo.Collection('studentStats');

Template.trackingList.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		this.trackingData = Meteor.subscribe('trackinglistPub', FlowRouter.getParam('selectedStudentId'), FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedTermId'), FlowRouter.getParam('selectedWeekId'));
	});

	Session.set({
		selectedStudentId: FlowRouter.getParam('selectedStudentId'),
		toolbarType: 'tracking',
		editUrl: '',
		newUrl: '',
	});
});

Template.trackingList.onRendered( function() {
	Session.set({
		labelOne: 'Tracking',
		activeNav: 'trackingList',
	});
});

Template.trackingList.helpers({
	subscriptionReady: function() {
		return Template.instance().trackingData.ready();
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
		return StudentStats.findOne({studentId: studentId}) && StudentStats.findOne({studentId: studentId}).yearProgress;
	},

	yearsProgressStatus: function(studentId) {
		let yearProgress = StudentStats.findOne({studentId: studentId}) && StudentStats.findOne({studentId: studentId}).yearProgress;
		if (yearProgress === 100) {
			return 'meter-progress-primary';
		}
		return false;
	},

	termsProgress: function(studentId) {
		return StudentStats.findOne({studentId: studentId}) && StudentStats.findOne({studentId: studentId}).termProgress;
	},

	termsProgressStatus: function(studentId) {
		let termProgress = StudentStats.findOne({studentId: studentId}) && StudentStats.findOne({studentId: studentId}).termProgress;
		if (termProgress === 100) {
			return 'meter-progress-primary';
		}
		return false;
	},

	weeksProgress: function(studentId) {
		return StudentStats.findOne({studentId: studentId}) && StudentStats.findOne({studentId: studentId}).weekProgress;
	},

	weeksProgressStatus: function(studentId) {
		let weekProgress = StudentStats.findOne({studentId: studentId}) && StudentStats.findOne({studentId: studentId}).weekProgress;
		if (weekProgress === 100) {
			return 'meter-progress-primary';
		}
		return false;
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedStudentId') === id) {
			return true;
		}
		return false;
	}

});









