import { Template } from 'meteor/templating';
import { Resources } from '../../../api/resources/resources.js';
import { Subjects } from '../../../api/subjects/subjects.js';
import { Terms } from '../../../api/terms/terms.js';
import { Weeks } from '../../../api/weeks/weeks.js';
import { Lessons } from '../../../api/lessons/lessons.js';

import {minutesConvert} from '../../../modules/functions';
import _ from 'lodash'
import './reportingList.html';

Template.reportingList.onCreated( function() {
	// Subscriptions
	this.subscribe('userReportSettings');
	this.subscribe('allResources');
	this.subscribe('allSubjects');
	this.subscribe('allTerms');
	this.subscribe('allWeeks');
	this.subscribe('allLessons');
});

Template.reportingList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		label: 'Reporting',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'reportingList');
});

Template.reportingList.helpers({
	user: function() {
		return Meteor.users.findOne();
	},
	
	// Selections
	reportsAvailable: function() {
		if (!Session.get('selectedSchoolYear') || !Session.get('selectedStudent')) {
			return false;
		}
		return true
	},
});










