import {Template} from 'meteor/templating';
import { Students } from '../../../../api/students/students.js';
import './studentsView.html';

Template.studentsView.onCreated( function() {
	// Subscriptions
	Tracker.autorun(() => {
		this.studentData = Meteor.subscribe('student', FlowRouter.getParam('selectedStudentId'));
	});
});

Template.studentsView.onRendered( function() {
	// ToolbarView Settings
	Session.set({
		label: 'Student',
		editUrl: '/planning/students/edit/' + FlowRouter.getParam('selectedStudentId'),
		deleteClass: 'js-delete-student',
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.studentsView.helpers({
	subscriptionReady: function() {
		return Template.instance().studentData.ready();
	},
	
	student: function() {
		return Students.findOne({_id: FlowRouter.getParam('selectedStudentId')});
	},

	preferredFirstName: function(currentType, type) {
		if (currentType === type) {
			return true;
		}
		return false;
	},
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
		Meteor.call('deleteStudent', FlowRouter.getParam('selectedStudentId'), function(error) {
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





