import { Template } from 'meteor/templating';
import { Reports } from '../../../api/reports/reports.js';
import { SchoolYears } from '../../../api/schoolYears/schoolYears.js';
import { Students } from '../../../api/students/students.js';
import { Resources } from '../../../api/resources/resources.js';
import { SchoolWork } from '../../../api/schoolWork/schoolWork.js';
import { Terms } from '../../../api/terms/terms.js';
import { Weeks } from '../../../api/weeks/weeks.js';
import { Lessons } from '../../../api/lessons/lessons.js';

import {minutesConvert} from '../../../modules/functions';
import _ from 'lodash'
import './reportingView.html';

Template.reportingView.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		this.reportSchoolYearData = Meteor.subscribe('reportSchoolYears', FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedStudentId'));
		this.reportTermData = Meteor.subscribe('reportTerms', FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedStudentId'));
		this.reportSchoolWorkData = Meteor.subscribe('reportSchoolWork', FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedStudentId'));
		this.reportResourceData = Meteor.subscribe('reportResources', FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedStudentId'));
		this.studentData = Meteor.subscribe('allStudents');
		this.pathData = Meteor.subscribe('studentSchoolYearsPath', FlowRouter.getParam('selectedStudentId'));
	});
});

Template.reportingView.onRendered( function() {
	Session.set({
		labelTwo: '',
		selectedSchoolYearId: FlowRouter.getParam('selectedSchoolYearId'),
		selectedStudentId: FlowRouter.getParam('selectedStudentId'),
		toolbarType: 'report',
		editUrl: '/reporting/edit/2/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedReportId'),
		activeNav: 'reportingList',
	});
});

Template.reportingView.helpers({
	subscriptionReady: function() {
		if (Template.instance().reportSchoolYearData.ready() && Template.instance().reportTermData.ready() && Template.instance().reportSchoolWorkData.ready() && Template.instance().reportResourceData.ready() && Template.instance().studentData.ready() && Template.instance().pathData.ready()) {
			return true;
		}
		return false;
	},

	user: function() {
		return Meteor.users.findOne();
	},

	selectedStudent: function() {
		return Students.findOne({_id: FlowRouter.getParam('selectedStudentId')});
	},

	schoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')});
	},

	studentCount: function() {
		return Counts.get('studentCount');
	},

	schoolYearCount: function() {
		return Counts.get('schoolYearCount');
	},

	reports: function() {
		return Reports.find({}, {sort: {name: 1}});
	},

	selectedReport: function() {
		return Reports.findOne({_id: FlowRouter.getParam('selectedReportId')})
	},

	reportName: function(name) {
		Session.set({labelTwo: name});
		return false;
	},
});

Template.reportingView.events({
	
});










