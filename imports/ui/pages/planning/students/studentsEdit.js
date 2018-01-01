import {Template} from 'meteor/templating';
import { Students } from '../../../../api/students/students.js';
import './studentsEdit.html';
import moment from 'moment';

Template.studentsEdit.onCreated( function() {
	// Subscriptions
	this.subscribe('student', FlowRouter.getParam('id'));
});

Template.studentsEdit.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		label: 'Edit Student',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');

	// Form Validation and Submission
	$('.js-form-students-update').validate({
		rules: {
			firstName: { required: true },
			lastName: { required: true },
			middleName: { required: false },
			nickname: { required: false },
			birthday: { required: true, date: true },
		},
		messages: {
			firstName: { required: "Required." },
			lastName: { required: "Required." },
			birthday: { required: "Required.", date: "Please enter a valid date." },
		},		

		submitHandler() {
			const studentProperties = {
				firstName: event.target.firstName.value.trim(),
				middleName: event.target.middleName.value.trim(),
				lastName: event.target.lastName.value.trim(),
				nickname: event.target.nickname.value.trim(),
				preferredFirstName: event.target.preferredFirstName.value.trim(),
				birthday: event.target.birthday.value.trim(),
			}

			if (studentProperties.preferredFirstName === 'firstName') {
				studentProperties.preferredFirstName = {type: 'firstName', name: studentProperties.firstName};
			} else if (studentProperties.preferredFirstName === 'middleName') {
				studentProperties.preferredFirstName = {type: 'middleName', name: studentProperties.middleName};
			} else {
				studentProperties.preferredFirstName = {type: 'nickname', name: studentProperties.nickname};
			}
			
			Meteor.call('updateStudent', FlowRouter.getParam('id'), studentProperties, function(error, studentId) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: error.reason,
					});
				} else {
					FlowRouter.go('/planning/students/view/' + FlowRouter.getParam('id'));
				}
			});

			return false;
		}
	});
})

Template.studentsEdit.helpers({
	student: function() {
		return Students.findOne({_id: FlowRouter.getParam('id')});
	},

	preferredFirstName: function(currentType, type) {
		if (currentType === type) {
			return true;
		}
		return false;
	},

	nameExists: function(name) {
		if (name) {
			return false;
		}
		return true;
	},

	birthday: function(date) {
		return moment(date).format('MMMM D, YYYY')
	},

	cancelPath: function() {
		return '/planning/students/view/' + FlowRouter.getParam('id');
	},
});

Template.studentsEdit.events({
	'keyup .js-input-middle-name'(event) {
		if (event.target.value.trim().length) {
			$('.js-radio-middle-name').prop('disabled', false);
		} else {
			if ($('.js-radio-middle-name').prop('checked')) {
				$('.js-radio-middle-name').prop('checked', false);
				$('.js-radio-first-name').prop('checked', true);
			}
			$('.js-radio-middle-name').prop('disabled', true);	
		}
	},

	'keyup .js-input-nickname'(event) {
		if (event.target.value.trim().length) {
			$('.js-radio-nickname').prop('disabled', false);
		} else {
			if ($('.js-radio-nickname').prop('checked')) {
				$('.js-radio-nickname').prop('checked', false);
				$('.js-radio-first-name').prop('checked', true);
			}
			$('.js-radio-nickname').prop('disabled', true);
		}
	},

	'submit .js-form-students-update'(event) {
		event.preventDefault();
	},
	
});









