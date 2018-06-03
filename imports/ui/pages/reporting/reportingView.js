import { Template } from 'meteor/templating';
import { Reports } from '../../../api/reports/reports.js';
import { SchoolYears } from '../../../api/schoolYears/schoolYears.js';
import { Students } from '../../../api/students/students.js';
import { Resources } from '../../../api/resources/resources.js';
import { Subjects } from '../../../api/subjects/subjects.js';
import { Terms } from '../../../api/terms/terms.js';
import { Weeks } from '../../../api/weeks/weeks.js';
import { Lessons } from '../../../api/lessons/lessons.js';

import {minutesConvert} from '../../../modules/functions';
import _ from 'lodash'
import './reportingView.html';

Template.reportingView.onCreated( function() {
	Tracker.autorun(() => {
		let routeName = FlowRouter.current().route.name;
		if (routeName === 'reportingNew' || routeName === 'reportingView' || routeName === 'reportingEdit' || routeName === 'reportingPrint') {
			this.reportSchoolYearData = Meteor.subscribe('reportSchoolYears', FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedStudentId'));
			this.reportTermData = Meteor.subscribe('reportTerms', FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedStudentId'));
			this.reportSubjectData = Meteor.subscribe('reportSubjects', FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedStudentId'));
			this.reportResourceData = Meteor.subscribe('reportResources', FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedStudentId'));
			this.studentData = Meteor.subscribe('allStudents');
			this.pathData = Meteor.subscribe('studentSchoolYearsPath', FlowRouter.getParam('selectedStudentId'));
		}
	});
});

Template.reportingView.onRendered( function() {
	// Toolbar Settings
	Session.set({
		selectedSchoolYearId: FlowRouter.getParam('selectedSchoolYearId'),
		selectedStudentId: FlowRouter.getParam('selectedStudentId'),
		toolbarType: 'report',
		editUrl: '/reporting/edit/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedReportId'),
		printUrl: '/reporting/print/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedReportId'),
	});
});

Template.reportingView.helpers({
	subscriptionReady: function() {
		if (Template.instance().reportSchoolYearData.ready() && Template.instance().reportTermData.ready() && Template.instance().reportSubjectData.ready() && Template.instance().reportResourceData.ready() && Template.instance().studentData.ready() && Template.instance().pathData.ready()) {
			return true;
		}
		return false;
	},

	user: function() {
		return Meteor.users.findOne();
	},

	student: function() {
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
});

Template.reportingView.events({
	'click .js-delete-report-confirmed'(event) {
		event.preventDefault();
		$('.loading-deleting').show();

		function nextReportId(selectedReportId) {
			let reportIds = Reports.find({}, {sort: {name: 1}}).map(report => (report._id));
			let selectedIndex = reportIds.indexOf(selectedReportId);

			if (selectedIndex) {
				return reportIds[selectedIndex - 1]
			}
			return reportIds[selectedIndex + 1]
		};

		let newReportId = nextReportId(FlowRouter.getParam('selectedReportId'));
		let dialogId = Dialogs.findOne()._id;

		Dialogs.remove({_id: dialogId});
		Meteor.call('deleteReport', FlowRouter.getParam('selectedReportId'), function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
			} else {
				Session.set('selectedReportId', newReportId);
				FlowRouter.go('/reporting/view/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ newReportId);
				$('.loading-deleting').hide();
			}
		});
	},
});










