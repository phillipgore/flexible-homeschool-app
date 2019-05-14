import {Template} from 'meteor/templating';
import {Stats} from '../../../api/stats/stats.js';
import {Paths} from '../../../api/paths/paths.js';
import {Students} from '../../../api/students/students.js';
import {SchoolYears} from '../../../api/schoolYears/schoolYears.js';
import {Terms} from '../../../api/terms/terms.js';
import {SchoolWork} from '../../../api/schoolWork/schoolWork.js';
import {Weeks} from '../../../api/weeks/weeks.js';
import {Lessons} from '../../../api/lessons/lessons.js';
import moment from 'moment';
import './subbarTracking.html';

Template.subbarTracking.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		// Subbar Subscriptions
		this.trackingStats = Meteor.subscribe('progressStatsPub');
		this.studentData = Meteor.subscribe('studentPaths');
		this.schoolYearData = Meteor.subscribe('schoolYearPaths', FlowRouter.getParam('selectedStudentId'));
		this.termData = Meteor.subscribe('termPaths', FlowRouter.getParam('selectedStudentId'), FlowRouter.getParam('selectedSchoolYearId'));
		this.weekData = Meteor.subscribe('weekPaths', FlowRouter.getParam('selectedStudentId'), FlowRouter.getParam('selectedTermId'));
	});
});

Template.subbarTracking.helpers({

	/* -------------------- Subscritpions -------------------- */

	trackingSubReady: function() {
		return Template.instance().trackingStats.ready();
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
		return Weeks.find({}, {sort: {order: 1}});
	},

	selectedWeek: function() {
		return Weeks.findOne({_id: FlowRouter.getParam('selectedWeekId')});
	},

	selectedWeekId: function() {
		return Session.get('selectedWeekId');
	},

	
	/* -------------------- Joins -------------------- */

	selectedFramePositionOne: function() {
		if (Session.get('selectedFramePosition') === 1 && Session.get('windowWidth') < 640) {
			return true;
		}
		return false;
	},

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
});


