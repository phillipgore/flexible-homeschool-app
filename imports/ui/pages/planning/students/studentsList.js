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
		label: 'Students',
		rightUrl: '/planning/students/new',
		rightIcon: 'fss-new',
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.studentsList.helpers({
	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
	},

	selectedStudentId: function() {
		return FlowRouter.getParam('selectedStudentId');
	},

	active: function(id) {
		if (Session.get('selectedStudentId') === id) {
			return true;
		}
		return false;
	}
});