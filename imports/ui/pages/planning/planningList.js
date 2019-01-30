import {Template} from 'meteor/templating';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Students } from '../../../api/students/students.js';
import { SchoolYears } from '../../../api/schoolYears/schoolYears.js';
import './planningList.html';
import _ from 'lodash'

Template.planningList.onCreated( function() {
	Meteor.call('getInitialSchoolWorkIds', function(error, result) {
		Session.set('initialSchoolWorkIds', result);
	});
});

Template.planningList.onRendered( function() {
	Session.set({
		labelOne: 'Planning',
		activeNav: 'planningList',
	});
});

Template.planningList.helpers({
	items: [
		{divider: false, classes: '', icon: 'icn-students', label: 'Students'},
		{divider: false, classes: '', icon: 'icn-school-years', label: 'School Years'},
		{divider: false, classes: '', icon: 'icn-resources', label: 'Resources'},
		{divider: false, classes: '', icon: 'icn-school-work', label: 'School Work'},
	],

	selectedStudentId: function() {
		return Session.get('selectedStudentId');
	},

	selectedSchoolYearId: function() {
		return Session.get('selectedSchoolYearId');
	},

	schoolWorkAvailable: function() {
		if (Counts.get('schoolYearCount') && Counts.get('studentCount')) {
			return true;
		}
		return false;
	},

	selectedResourceType: function() {
		return Session.get('selectedResourceType');
	},

	selectedResourceAvailability: function() {
		return Session.get('selectedResourceAvailability');
	},

	selectedResourceId: function() {
		return Session.get('selectedResourceId');
	},

	selectedResourceCurrentTypeId: function() {
		return Session.get('selectedResourceCurrentTypeId');
	},

	typeIsAll: function(type) {
		if (type === 'all') {
			return true;
		}
		return false;
	},

	selectedSchoolWorkId: function() {
		return Session.get('selectedSchoolWorkId');
	},

	studentSchoolYearSchoolWorkId: function(studentId, schoolYearId) {
		let schoolWorkIds = Session.get('initialSchoolWorkIds');
		if (schoolWorkIds) {
			let key = 'schoolWork' + studentId + schoolYearId;
			return schoolWorkIds[key];
		}
		return null;
	},

	active: function(currentRoute, route) {
		if (currentRoute === route) {
			return true;
		}
		return false;
	},
});

Template.planningList.events({
	'click .js-planning'(event) {
		Session.set('planningPathName', $(event.currentTarget).attr('id'))
	},
});