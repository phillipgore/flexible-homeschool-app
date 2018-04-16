import {Template} from 'meteor/templating';
import {SchoolYears} from '../../../api/schoolYears/schoolYears.js';
import {Terms} from '../../../api/terms/terms.js';
import {Subjects} from '../../../api/subjects/subjects.js';
import {Weeks} from '../../../api/weeks/weeks.js';
import {Lessons} from '../../../api/lessons/lessons.js';
import moment from 'moment';
import './subbarTrackingStudent.html';

Template.subbarTrackingStudent.onCreated( function() {
	// Subscriptions
	this.subscribe('schoolYearsSubbar', FlowRouter.getParam('id'));
	this.subscribe('termsSubbar', FlowRouter.getParam('id'), FlowRouter.getParam('selectedSchoolYearId'));
	this.subscribe('weeksSubbar', FlowRouter.getParam('id'), FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedTermId'));

	Session.set('selectedSchoolYearId', FlowRouter.getParam('selectedSchoolYearId'));
	Session.set('selectedTermId', FlowRouter.getParam('selectedTermId'));
	Session.set('selectedWeekId', FlowRouter.getParam('selectedWeekId'));
});

Template.subbarTrackingStudent.helpers({
	selectedStudentId: function() {
		return FlowRouter.getParam('id');
	},

	schoolYears: function() {
		return SchoolYearsSubbar.find({}, {sort: {startYear: 1}});
	},

	selectedSchoolYearId: function() {
		return FlowRouter.getParam('selectedSchoolYearId');
	},

	selectedSchoolYear: function() {
		return SchoolYearsSubbar.findOne({schoolYearId: FlowRouter.getParam('selectedSchoolYearId')});
	},

	yearStatus: function(schoolYearStatus) {
		if (schoolYearStatus === 'pending') {
			return 'txt-gray-darker';
		}
		if (schoolYearStatus === 'partial') {
			return 'txt-secondary';
		}
		if (schoolYearStatus === 'completed') {
			return 'txt-primary';
		}
	},

	terms: function() {
		return TermsSubbar.find({}, {sort: {order: 1}});
	},

	selectedTermId: function() {
		return FlowRouter.getParam('selectedTermId');
	},

	selectedTerm: function() {
		return TermsSubbar.findOne({termId: FlowRouter.getParam('selectedTermId')});
	},

	termStatus: function(termStatus) {
		if (termStatus === 'pending') {
			return 'txt-gray-darker';
		}
		if (termStatus === 'partial') {
			return 'txt-secondary';
		}
		if (termStatus === 'completed') {
			return 'txt-primary';
		}
	},

	weeks: function() {
		return WeeksSubbar.find({}, {sort: {order: 1}});
	},

	selectedWeekId: function() {
		return FlowRouter.getParam('selectedWeekId');
	},

	selectedWeek: function() {
		return WeeksSubbar.findOne({weekId: FlowRouter.getParam('selectedWeekId')});
	},

	weekStatus: function(weekStatus) {
		if (weekStatus === 'pending') {
			return 'txt-gray-darker';
		}
		if (weekStatus === 'partial') {
			return 'txt-secondary';
		}
		if (weekStatus === 'completed') {
			return 'txt-primary';
		}
	},

	activeListItem: function(currentItem, item) {
		if (currentItem === item) {
			return true;
		}
		return false;
	},
});

Template.subbarTrackingStudent.events({
	'click .js-school-years'(event) {
		event.preventDefault();

		let newSchoolYearId = $(event.currentTarget).attr('id');
		if (Session.get('selectedSchoolYearId') != newSchoolYearId) {
			Session.set('selectedSchoolYearId', newSchoolYearId);
			FlowRouter.go($(event.currentTarget).attr('href'));
		}
		return false;
	},

	'click .js-terms'(event) {
		event.preventDefault();

		let newTermId = $(event.currentTarget).attr('id');
		if (Session.get('selectedTermId') != newTermId) {
			Session.set('selectedTermId', newTermId);
			FlowRouter.go($(event.currentTarget).attr('href'));
		}
		return false;
	},

	'click .js-weeks'(event) {
		event.preventDefault();

		let newWeekId = $(event.currentTarget).attr('id');
		if (Session.get('selectedWeekId') != newWeekId) {
			Session.set('selectedWeekId', newWeekId);
			FlowRouter.go($(event.currentTarget).attr('href'));
		}
		return false;
	},
});

