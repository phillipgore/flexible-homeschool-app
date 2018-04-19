import {Template} from 'meteor/templating';
import { Subjects } from '../../../../api/subjects/subjects.js';
import { Students } from '../../../../api/students/students.js';
import './subjectsList.html';

Template.subjectsList.onCreated( function() {
	// Subscriptions
	this.subscribe('schooYearStudentSubjects', FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedStudentId'));
	
	Session.set('selectedSchoolYearId', FlowRouter.getParam('selectedSchoolYearId'));
	Session.set('selectedStudentId', FlowRouter.getParam('selectedStudentId'));
});

Template.subjectsList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '/planning/list',
		leftIcon: 'fss-back',
		label: 'Subjects',
		rightUrl: '/planning/subjects/new',
		rightIcon: 'fss-new',
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.subjectsList.helpers({
	subjectsCount: function() {
		return Subjects.find().count();
	},

	subjects: function() {
		return Subjects.find({}, {sort: {order: 1}});
	},
});

Template.subjectsList.events({
	
});