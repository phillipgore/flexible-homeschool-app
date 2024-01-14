import {Template} from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Students } from '../../../../api/students/students.js';
import './studentsEdit.html';

import moment from 'moment';
import _ from 'lodash';

Template.studentsEdit.onCreated( function() {	
	let template = Template.instance();
	
	template.autorun(() => {
		this.studentData = Meteor.subscribe('student', FlowRouter.getParam('selectedStudentId'));
	});
});

Template.studentsEdit.onRendered( function() {
	let template = Template.instance();

	Session.set({
		toolbarType: 'edit',
		labelThree: 'Edit Student',
		activeNav: 'planningList',
	});

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
			$('.js-updating').show();
			$('.js-submit').prop('disabled', true);

			const studentProperties = {
				firstName: template.find("[name='firstName']").value.trim(),
				middleName: template.find("[name='middleName']").value.trim(),
				lastName: template.find("[name='lastName']").value.trim(),
				nickname: template.find("[name='nickname']").value.trim(),
				preferredFirstName: template.find("[name='preferredFirstName']:checked").value.trim(),
				birthday: template.find("[name='birthday']").value.trim(),
			}

			if (_.has(studentProperties, 'birthday')) {
				studentProperties.birthday = moment(studentProperties.birthday).toISOString();
			}
			
			if (studentProperties.preferredFirstName === 'firstName') {
				studentProperties.preferredFirstName = {type: 'firstName', name: studentProperties.firstName};
			} else if (studentProperties.preferredFirstName === 'middleName') {
				studentProperties.preferredFirstName = {type: 'middleName', name: studentProperties.middleName};
			} else {
				studentProperties.preferredFirstName = {type: 'nickname', name: studentProperties.nickname};
			}

			let pathProperties = {
				studentIds: [FlowRouter.getParam('selectedStudentId')],
				schoolYearIds: [],
				termIds: [],
			}
			
			Meteor.call('updateStudent', pathProperties, FlowRouter.getParam('selectedStudentId'), studentProperties, function(error, studentId) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'icn-danger',
						message: error.reason,
					});
					
					$('.js-updating').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					FlowRouter.go('/planning/students/view/3/' + FlowRouter.getParam('selectedStudentId'));
				}
			});

			return false;
		}
	});
})

Template.studentsEdit.helpers({
	student: function() {
		return Students.findOne({_id: FlowRouter.getParam('selectedStudentId')});
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

	'click .js-cancel'(event) {
		event.preventDefault();

		if (window.screen.availWidth > 768) {
			FlowRouter.go('/planning/students/view/3/' + FlowRouter.getParam('selectedStudentId'))
		} else {
			FlowRouter.go('/planning/students/view/2/' + FlowRouter.getParam('selectedStudentId'))
		}

	},
	
});









