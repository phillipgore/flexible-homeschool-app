import {Template} from 'meteor/templating';
import { Students } from '../../../api/students/students.js';
import { Subjects } from '../../../api/subjects/subjects.js';
import { SchoolYears } from '../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../api/terms/terms.js';
import { Weeks } from '../../../api/weeks/weeks.js';
import { Lessons } from '../../../api/lessons/lessons.js';
import './trackingList.html';

Template.trackingList.onCreated( function() {
	// Subscriptions
	this.subscribe('allSchoolYearsPath', FlowRouter.getParam('selectedStudentId'));
	this.subscribe('allStudentStats', FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedTermId'));
	this.subscribe('allTermsPath', FlowRouter.getParam('selectedSchoolYearId'))

	Session.set('selectedSchoolYearId', FlowRouter.getParam('selectedSchoolYearId'));
	Session.set('selectedTermId', FlowRouter.getParam('selectedTermId'));
});

Template.trackingList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		label: 'Tracking',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'trackingList');
});

Template.trackingList.helpers({
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

	yearsProgressStatus: function(yearProgress) {
		if (yearProgress === 100) {
			return 'meter-progress-primary';
		}
		return false;
	},

	termsProgressStatus: function(termProgress) {
		if (termProgress === 100) {
			return 'meter-progress-primary';
		}
		return false;
	},

});