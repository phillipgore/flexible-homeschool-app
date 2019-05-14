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
		this.studentData = this.subscribe('studentPaths');
		this.schoolYearData = Meteor.subscribe('schoolYearPaths', FlowRouter.getParam('selectedStudentId'));
		this.termData = Meteor.subscribe('termPaths', FlowRouter.getParam('selectedStudentId'), FlowRouter.getParam('selectedSchoolYearId'));
		this.weekData = Meteor.subscribe('weekPaths', FlowRouter.getParam('selectedStudentId'), FlowRouter.getParam('selectedTermId'));
	});
});

Template.subbarReporting.helpers({

	/* -------------------- Subscritpions -------------------- */

	studentSubReady: function() {
		return Template.instance().studentData.ready();
	},

	schoolYearSubReady: function() {
		return Template.instance().schoolYearData.ready();
	},

	termSubReady: function() {
		return Template.instance().termData.ready();
	},

	weekSubReady: function() {
		return Template.instance().weekData.ready();
	},

	
	/* -------------------- Students -------------------- */

	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
	},

	selectedStudent: function() {
		return Students.findOne({_id: FlowRouter.getParam('selectedStudentId')});
	},

	selectedStudentId: function() {
		return Session.get('selectedStudentId');
	},

	
	/* -------------------- SchooYears -------------------- */

	schoolYears: function() {
		return SchoolYears.find({}, {sort: {startYear: 1}});
	},

	selectedSchoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')});
	},

	selectedSchoolYearId: function() {
		return Session.get('selectedSchoolYearId');
	},

	
	/* -------------------- Terms -------------------- */

	terms: function() {
		return Terms.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}, {sort: {order: 1}});
	},

	selectedTerm: function() {
		return Terms.findOne({_id: FlowRouter.getParam('selectedTermId')});
	},

	selectedTermId: function() {
		return Session.get('selectedTermId');
	},

	
	/* -------------------- Weeks -------------------- */

	weeks: function() {
		return Weeks.find({termId: FlowRouter.getParam('selectedTermId')}, {sort: {order: 1}});
	},

	selectedWeek: function() {
		return Weeks.findOne({_id: FlowRouter.getParam('selectedWeekId')});
	},

	selectedWeekId: function() {
		return Session.get('selectedWeekId');
	},

	
	/* -------------------- Reports -------------------- */

	reports: function() {
		return Reports.find();
	},

	selectedReport: function() {
		return Reports.findOne({_id: FlowRouter.getParam('selectedReportId')});
	},

	selectedReportId: function() {
		return Session.get('selectedReportId');
	},

	
	/* -------------------- Joins -------------------- */

	firstTermId: function(timeFrameId) {
		return Paths.findOne({studentId: FlowRouter.getParam('selectedStudentId'), timeFrameId: timeFrameId}).firstTermId;
	},

	firstWeekId: function(timeFrameId) {
		return Paths.findOne({studentId: FlowRouter.getParam('selectedStudentId'), timeFrameId: timeFrameId}).firstWeekId;
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
		let status = Stats.findOne({studentId: FlowRouter.getParam('selectedStudentId'), timeFrameId: timeFrameId}).status;
		
		if (status === 'empty') {
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
		if (Session.get('selectedSchoolYearId') === 'empty' || Session.get('selectedStudentId') === 'empty' || Session.get('selectedReportId') === 'empty') {
			return false;
		}
		return true;
	},
});










