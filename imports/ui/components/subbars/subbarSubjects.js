import {Template} from 'meteor/templating';
import {SchoolYears} from '../../../api/schoolYears/schoolYears.js';
import {Students} from '../../../api/students/students.js';
import moment from 'moment';
import './subbarSubjects.html';

Template.subbarSubjects.onCreated( function() {
	// Subscriptions
	this.subscribe('schoolYearsSubbar', FlowRouter.getParam('selectedStudentId'));
	this.subscribe('allStudents');
	
	Session.set('selectedSchoolYearId', FlowRouter.getParam('selectedSchoolYearId'));
	Session.set('selectedStudentId', FlowRouter.getParam('selectedStudentId'));
});

Template.subbarSubjects.helpers({
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

	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
	},

	selectedStudentId: function() {
		return FlowRouter.getParam('selectedStudentId');
	},

	selectedStudent: function() {
		return Students.findOne({_id: FlowRouter.getParam('selectedStudentId')});
	},
	
	activeListItem: function(currentItem, item) {
		if (currentItem === item) {
			return true;
		}
		return false;
	},
});

Template.subbarSubjects.events({
	'click .js-school-years'(event) {
		event.preventDefault();

		let newSchoolYearId = $(event.currentTarget).attr('id');
		if (Session.get('selectedSchoolYearId') != newSchoolYearId) {
			Session.set('selectedSchoolYearId', newSchoolYearId);
			FlowRouter.go($(event.currentTarget).attr('href'));
		}
		return false;
	},

	'click .js-students'(event) {
		event.preventDefault();

		let newStudentId = $(event.currentTarget).attr('id');
		if (Session.get('selectedStudentId') != newStudentId) {
			Session.set('selectedStudentId', newStudentId);
			FlowRouter.go($(event.currentTarget).attr('href'));
		}
		return false;
	},
});