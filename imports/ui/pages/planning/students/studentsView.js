import {Template} from 'meteor/templating';
import { Students } from '../../../../api/students/students.js';
import './studentsView.html';

Template.studentsView.onCreated( function() {
	Tracker.autorun(() => {
		this.studentData = Meteor.subscribe('student', FlowRouter.getParam('selectedStudentId'));
	});
});

Template.studentsView.onRendered( function() {
	// Toolbar Settings
	Session.set({
		toolbarType: 'student',
		editUrl: '/planning/students/edit/3/' + FlowRouter.getParam('selectedStudentId'),
		labelThree: 'Student',
		activeNav: 'planningList',
	});
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
	'click .js-delete-student-confirmed'(event) {
		event.preventDefault();
		$('.js-deleting').show();

		function nextStudentId(selectedStudentId) {
			let studentIds = Students.find({}, {sort: {birthday: 1, lastName: 1, firstName: 1}}).map(student => (student._id));
			let selectedIndex = studentIds.indexOf(selectedStudentId);

			if (selectedIndex) {
				return studentIds[selectedIndex - 1]
			}
			return studentIds[selectedIndex + 1]
		};

		let newStudentId = nextStudentId(FlowRouter.getParam('selectedStudentId'));
		let dialogId = Dialogs.findOne()._id;

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
				Session.set('selectedStudentId', newStudentId)
				FlowRouter.go('/planning/students/view/3/' + newStudentId);
				$('.js-deleting').hide();
			}
		});
	}
});





