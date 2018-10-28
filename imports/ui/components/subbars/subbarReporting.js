import {Template} from 'meteor/templating';
import {Students} from '../../../api/students/students.js';
import {SchoolYears} from '../../../api/schoolYears/schoolYears.js';
import {Terms} from '../../../api/terms/terms.js';
import {Weeks} from '../../../api/weeks/weeks.js';
import {Reports} from '../../../api/reports/reports.js';
import moment from 'moment';
import './subbarReporting.html';

Template.subbarReporting.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		this.schoolYearData = Meteor.subscribe('studentSchoolYearsPath', FlowRouter.getParam('selectedStudentId'));
		this.termData = Meteor.subscribe('studentTermsPath', FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedStudentId'), true);
		this.weekData = Meteor.subscribe('weeksPath', FlowRouter.getParam('selectedStudentId'), FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedTermId'), true);
	});
});

Template.subbarReporting.helpers({
	schoolYearSubReady: function() {
		return Template.instance().schoolYearData.ready();
	},

	termSubReady: function() {
		return Template.instance().termData.ready();
	},

	weekSubReady: function() {
		return Template.instance().weekData.ready();
	},

	schoolYears: function() {
		return SchoolYears.find({}, {sort: {startYear: 1}});
	},

	selectedSchoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')});
	},

	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
	},

	selectedStudent: function() {
		return Students.findOne({_id: FlowRouter.getParam('selectedStudentId')});
	},

	yearStatus: function(schoolYearStatus) {
		if (schoolYearStatus === 'empty') {
			return 'fss-open-circle txt-gray-darker';
		}
		if (schoolYearStatus === 'pending') {
			return 'fss-circle txt-gray-darker';
		}
		if (schoolYearStatus === 'partial') {
			return 'fss-circle txt-secondary';
		}
		if (schoolYearStatus === 'assigned') {
			return 'fss-circle txt-warning';
		}
		if (schoolYearStatus === 'completed') {
			return 'fss-circle txt-primary';
		}
	},

	terms: function() {
		return Terms.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}, {sort: {order: 1}});
	},

	selectedTerm: function() {
		return Terms.findOne({_id: FlowRouter.getParam('selectedTermId')});
	},

	termStatus: function(termStatus) {
		if (termStatus === 'empty') {
			return 'fss-open-circle txt-gray-darker';
		}
		if (termStatus === 'pending') {
			return 'fss-circle txt-gray-darker';
		}
		if (termStatus === 'partial') {
			return 'fss-circle txt-secondary';
		}
		if (termStatus === 'assigned') {
			return 'fss-circle txt-warning';
		}
		if (termStatus === 'completed') {
			return 'fss-circle txt-primary';
		}
	},

	weeks: function() {
		return Weeks.find({termId: FlowRouter.getParam('selectedTermId')}, {sort: {order: 1}});
	},

	selectedWeek: function() {
		return Weeks.findOne({_id: FlowRouter.getParam('selectedWeekId')});
	},

	weekStatus: function(weekStatus) {
		if (weekStatus === 'empty') {
			return 'fss-open-circle txt-gray-darker';
		}
		if (weekStatus === 'pending') {
			return 'fss-circle txt-gray-darker';
		}
		if (weekStatus === 'partial') {
			return 'fss-circle txt-secondary';
		}
		if (weekStatus === 'assigned') {
			return 'fss-circle txt-warning';
		}
		if (weekStatus === 'completed') {
			return 'fss-circle txt-primary';
		}
	},

	selectedReport: function() {
		return Reports.findOne({_id: FlowRouter.getParam('selectedReportId')});
	},
	
	activeListItem: function(currentItem, item) {
		if (currentItem === item) {
			return true;
		}
		return false;
	},
	
	reportsAvailable: function() {
		if (Session.get('selectedSchoolYearId') === 'empty' || Session.get('selectedStudentId') === 'empty') {
			return false;
		}
		return true;
	},
});










