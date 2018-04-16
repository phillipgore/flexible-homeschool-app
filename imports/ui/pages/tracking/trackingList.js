import {Template} from 'meteor/templating';
import { Students } from '../../../api/students/students.js';
import { Subjects } from '../../../api/subjects/subjects.js';
import { SchoolYears } from '../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../api/terms/terms.js';
import { Weeks } from '../../../api/weeks/weeks.js';
import { Lessons } from '../../../api/lessons/lessons.js';
import './trackingList.html';

TrackingStats = new Mongo.Collection('trackingStats');

Template.trackingList.onCreated( function() {
	// Subscriptions
	this.subscribe('termsSubbar', null, FlowRouter.getParam('selectedSchoolYearId'));
	this.subscribe('trackingStats', FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedTermId'));
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
	stats: function() {
		return TrackingStats.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
	},

	selectedSchoolYearId: function() {
		return FlowRouter.getParam('selectedSchoolYearId');
	},

	selectedTermId: function() {
		return FlowRouter.getParam('selectedTermId');
	},

	selectedWeekId: function() {
		return TermsSubbar.findOne({termId: FlowRouter.getParam('selectedTermId')}).firstWeekId;
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