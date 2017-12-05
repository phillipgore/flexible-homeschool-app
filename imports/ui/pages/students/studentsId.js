import {Template} from 'meteor/templating';
import { Students } from '../../../api/students/students.js';
import './studentsId.html';

Template.studentsId.onRendered( function() {
	// Subscriptions
	Meteor.subscribe('student', FlowRouter.getParam('id'));

	// Toolbar Settings
	Session.set({
		leftUrl: '/students/list',
		leftIcon: 'fss-btn-back',
		leftCaret: false,
		label: '',
		rightUrl: '',
		rightIcon: 'fss-btn-settings',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'studentsList');
});

Template.studentsId.helpers({
	student: function() {
		return Students.findOne({_id: FlowRouter.getParam('id')});
	},
	dynamicToolbarLabel: function() {
		let student = Students.findOne({_id: FlowRouter.getParam('id')});
		return student && student.preferredFirstName +' '+ student.lastName;
	}
});