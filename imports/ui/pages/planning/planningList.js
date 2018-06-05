import {Template} from 'meteor/templating';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Students } from '../../../api/students/students.js';
import { SchoolYears } from '../../../api/schoolYears/schoolYears.js';
import './planningList.html';
import _ from 'lodash'

Template.planningList.onRendered( function() {
	Session.set({
		labelOne: 'Planning',
		activeNav: 'planningList',
	});
});

Template.planningList.helpers({
	items: [
		{divider: false, classes: '', icon: 'fss-students', label: 'Students'},
		{divider: false, classes: '', icon: 'fss-school-years', label: 'School Years'},
		{divider: false, classes: '', icon: 'fss-resources', label: 'Resources'},
		{divider: false, classes: '', icon: 'fss-subjects', label: 'Subjects'},
	],

	selectedStudentId: function() {
		return Session.get('selectedStudentId');
	},

	selectedSchoolYearId: function() {
		return Session.get('selectedSchoolYearId');
	},

	subjectAvailable: function() {
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

	selectedSubjectId: function() {
		return Session.get('selectedSubjectId');
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