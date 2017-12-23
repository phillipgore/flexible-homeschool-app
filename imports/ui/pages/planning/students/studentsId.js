import {Template} from 'meteor/templating';
import { Students } from '../../../../api/students/students.js';
import './studentsId.html';
import moment from 'moment';

Template.studentsId.onCreated( function() {
	// Subscriptions
	this.subscribe('student', FlowRouter.getParam('id'));
});

Template.studentsId.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '/planning/students/list',
		leftIcon: 'fss-btn-back',
		leftCaret: false,
		label: '',
		rightUrl: '/planning/students/' + FlowRouter.getParam('id') + '/edit',
		rightIcon: 'fss-btn-edit',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.studentsId.helpers({
	student: function() {
		return Students.findOne({_id: FlowRouter.getParam('id')});
	},
	
	dynamicToolbarLabel: function() {
		let student = Students.findOne({_id: FlowRouter.getParam('id')});
		return student && student.preferredFirstName.name +' '+ student.lastName;
	},

	preferredFirstName: function(currentType, type) {
		if (currentType === type) {
			return true;
		}
		return false;
	},

	birthday: function(date) {
		return moment(date).format('MMMM D, YYYY')
	}
});