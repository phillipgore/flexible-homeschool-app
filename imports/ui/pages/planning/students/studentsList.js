import {Template} from 'meteor/templating';
import { Students } from '../../../../api/students/students.js';
import './studentsList.html';

Template.studentsList.onCreated( function() {
	// Subscriptions
	this.subscribe('allStudents');
});

Template.studentsList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '/planning/list',
		leftIcon: 'fss-btn-back',
		leftCaret: false,
		label: 'Students',
		rightUrl: '/planning/students/new',
		rightIcon: 'fss-btn-new',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.studentsList.helpers({
	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
	},
});