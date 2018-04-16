import {Template} from 'meteor/templating';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Students } from '../../../api/students/students.js';
import { SchoolYears } from '../../../api/schoolYears/schoolYears.js';
import './planningList.html';

Template.planningList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		label: 'Planning',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.planningList.helpers({
	items: [
		// {divider: false, classes: '', icon: 'fss-notes', label: 'All Notes', url: '/planning/notes'},
		{divider: false, classes: '', icon: 'fss-students', label: 'Students', url: '/planning/students/list'},
		{divider: false, classes: '', icon: 'fss-school-years', label: 'School Years', url: '/planning/schoolyears/list'},
		{divider: false, classes: '', icon: 'fss-resources', label: 'Resources', url: '/planning/resources/list'},
		{divider: false, classes: '', icon: 'fss-subjects', label: 'Subjects', url: '/planning/subjects/list'},
	],

	subjectAvailable: function() {
		if (Counts.get('schoolYearCount') && Counts.get('studentCount')) {
			return true;
		}
		return false;
	},

	selectedSchoolYearId: function() {
		return Session.get('selectedSchoolYearId');
	},

	selectedStudentId: function() {
		return Session.get('selectedStudentId');
	},

	selectedResourceType: function() {
		return Session.get('selectedResourceType');
	},

	selectedResourceAvailability: function() {
		return Session.get('selectedResourceAvailability');
	},
});