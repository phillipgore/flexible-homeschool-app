import {Template} from 'meteor/templating';
import { Students } from '../../../../api/students/students.js';
import './studentsView.html';
import moment from 'moment';

Template.studentsView.onCreated( function() {
	// Subscriptions
	this.subscribe('student', FlowRouter.getParam('id'));
});

Template.studentsView.onRendered( function() {
	// ToolbarView Settings
	Session.set({
		leftUrl: '/planning/students/list',
		leftIcon: 'fss-back',
		label: '',
		editUrl: '/planning/students/edit/' + FlowRouter.getParam('id'),
		deleteClass: 'js-delete-student',
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.studentsView.helpers({
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

Template.studentsView.events({
	'click .js-delete-student'(event) {
		event.preventDefault();

		Dialogs.insert({
			heading: 'Confirmation',
			message: 'Are you sure you want to delete this Student?',
			confirmClass: 'js-delete-student-confirmed',
		});
	},

	'click .js-delete-student-confirmed'(event) {
		event.preventDefault();
		const dialogId = Dialogs.findOne()._id;
		Dialogs.remove({_id: dialogId});
		Meteor.call('deleteStudent', FlowRouter.getParam('id'), function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
			} else {
				Dialogs.remove({_id: dialogId});
				FlowRouter.go('/planning/students/list');
			}
		});
	}
});





