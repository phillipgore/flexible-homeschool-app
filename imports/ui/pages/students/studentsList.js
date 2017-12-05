import {Template} from 'meteor/templating';
import { Students } from '../../../api/students/students.js';
import './studentsList.html';

Template.studentsList.onRendered( function() {
	// Subscriptions
	Meteor.subscribe('allStudents');

	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		leftCaret: false,
		label: 'Students',
		rightUrl: '/students/new',
		rightIcon: 'fss-btn-new',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'studentsList');
});

Template.studentsList.helpers({
	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
	},
});