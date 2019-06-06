import {Template} from 'meteor/templating';
import {Stats} from '../../../api/stats/stats.js';
import {Paths} from '../../../api/paths/paths.js';
import {Students} from '../../../api/students/students.js';
import {SchoolYears} from '../../../api/schoolYears/schoolYears.js';
import {Terms} from '../../../api/terms/terms.js';
import {Weeks} from '../../../api/weeks/weeks.js';
import {Reports} from '../../../api/reports/reports.js';

import _ from 'lodash';
import moment from 'moment';
import './subbarReporting.html';

Template.subbarReporting.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		this.trackingStats = Meteor.subscribe('progressStatsPub');
		this.studentData = Meteor.subscribe('allStudents');
		this.pathData = Meteor.subscribe('allPaths');
		this.schoolYearData = Meteor.subscribe('allSchoolYears');
		this.termData = Meteor.subscribe('allTerms');
		this.weekData = Meteor.subscribe('allWeeks');
	});
});

Template.subbarReporting.helpers({

	/* -------------------- Subscritpions -------------------- */

	studentSubReady: function() {
		return Template.instance().studentData.ready();
	},

	schoolYearSubReady: function() {
		if (Template.instance().schoolYearData.ready() && Template.instance().pathData.ready()) {
			return true;
		}
		return false;
	},

	termSubReady: function() {
		if (Template.instance().termData.ready() && Template.instance().pathData.ready()) {
			return true;
		}
		return false;
	},

	weekSubReady: function() {
		if (Template.instance().weekData.ready() && Template.instance().pathData.ready()) {
			return true;
		}
		return false;
	},

	
	/* -------------------- Students -------------------- */

	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
	},

	selectedStudent: function() {
		return Students.findOne({_id: FlowRouter.getParam('selectedStudentId')});
	},

	selectedStudentId: function() {
		return FlowRouter.getParam('selectedStudentId');
	},

	
	/* -------------------- SchooYears -------------------- */

	schoolYears: function() {
		return SchoolYears.find({}, {sort: {startYear: 1}});
	},

	selectedSchoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')});
	},

	selectedSchoolYearId: function() {
		return FlowRouter.getParam('selectedSchoolYearId');
	},

	
	/* -------------------- Terms -------------------- */

	terms: function() {
		return Terms.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}, {sort: {order: 1}});
	},

	selectedTerm: function() {
		return Terms.findOne({_id: FlowRouter.getParam('selectedTermId')});
	},

	selectedTermId: function() {
		return FlowRouter.getParam('selectedTermId');
	},

	
	/* -------------------- Weeks -------------------- */

	weeks: function() {
		return Weeks.find({termId: FlowRouter.getParam('selectedTermId')}, {sort: {order: 1}});
	},

	selectedWeek: function() {
		return Weeks.findOne({_id: FlowRouter.getParam('selectedWeekId')});
	},

	selectedWeekId: function() {
		return FlowRouter.getParam('selectedWeekId');
	},

	
	/* -------------------- Reports -------------------- */

	reports: function() {
		return Reports.find();
	},

	selectedReport: function() {
		return Reports.findOne({_id: FlowRouter.getParam('selectedReportId')});
	},

	selectedReportId: function() {
		return FlowRouter.getParam('selectedReportId');
	},

	
	/* -------------------- Joins -------------------- */

	firstTermId: function(timeFrameId) {
		return Paths.findOne({studentId: FlowRouter.getParam('selectedStudentId'), timeFrameId: timeFrameId}) && Paths.findOne({studentId: FlowRouter.getParam('selectedStudentId'), timeFrameId: timeFrameId}).firstTermId;
	},

	firstWeekId: function(timeFrameId) {
		return Paths.findOne({studentId: FlowRouter.getParam('selectedStudentId'), timeFrameId: timeFrameId}) && Paths.findOne({studentId: FlowRouter.getParam('selectedStudentId'), timeFrameId: timeFrameId}).firstWeekId;
	},

	studentsSchoolYearsCount: function() {
		if (Students.find().count() && SchoolYears.find().count()) {
			return true;
		}
		return false;
	},
	
	activeListItem: function(currentItem, item) {
		if (currentItem === item) {
			return true;
		}
		return false;
	},

	getStatus: function(timeFrameId) {
		let status = Stats.findOne({studentId: FlowRouter.getParam('selectedStudentId'), timeFrameId: timeFrameId}) && Stats.findOne({studentId: FlowRouter.getParam('selectedStudentId'), timeFrameId: timeFrameId}).status;

		if (status === 'empty' || _.isUndefined(status)) {
			return 'icn-open-circle txt-gray-darker';
		}
		if (status === 'pending') {
			return 'icn-circle txt-gray-darker';
		}
		if (status === 'partial') {
			return 'icn-circle txt-secondary';
		}
		if (status === 'assigned') {
			return 'icn-circle txt-warning';
		}
		if (status === 'completed') {
			return 'icn-circle txt-primary';
		}
	},
	
	reportsAvailable: function() {
		if (FlowRouter.getParam('selectedSchoolYearId') === 'empty' || FlowRouter.getParam('selectedStudentId') === 'empty' || FlowRouter.getParam('selectedReportId') === 'empty') {
			return false;
		}
		return true;
	},
});










