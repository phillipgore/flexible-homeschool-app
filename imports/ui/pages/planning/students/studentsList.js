import {Template} from 'meteor/templating';
import { Paths } from '../../../../api/paths/paths.js';
import { Students } from '../../../../api/students/students.js';
import './studentsList.html';

Template.studentsList.onCreated( function() {
	DocHead.setTitle('Planning: Students: View');
	// Subscriptions
	this.subscribe('allStudents');
	this.subscribe('allPaths');
});

Template.studentsList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		labelTwo: 'Students',
		newUrl: '/planning/students/new/3',
		activeNav: 'planningList',
	});
});

Template.studentsList.helpers({
	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
	},

	selectedStudentId: function() {
		return FlowRouter.getParam('selectedStudentId');
	},

	activeRoute: function(currentRoute, route) {
		if (currentRoute === route) {
			return true;
		}
		return false;
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedStudentId') === id) {
			return true;
		}
		return false;
	}
});