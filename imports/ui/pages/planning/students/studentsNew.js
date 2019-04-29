import {Template} from 'meteor/templating';
import './studentsNew.html';

import moment from 'moment';
import _ from 'lodash';

Template.studentsNew.onRendered( function() {
	let template = Template.instance();

	if (window.screen.availWidth > 640) {
		document.getElementsByClassName('frame-two')[0].scrollTop = 0;
	}

	Session.set({
		toolbarType: 'new',
		labelThree: 'New Student',
		activeNav: 'planningList',
	});

	// Form Validation and Submission
	$('.js-form-students-new').validate({
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
			$('.js-saving').show();
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
			
			Meteor.call('insertStudent', studentProperties, function(error, studentId) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'icn-danger',
						message: error.reason,
					});
					
					$('.js-saving').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					Session.set('selectedStudentId', studentId);

					// let resourcesScrollTop = document.getElementById(studentId).getBoundingClientRect().top - 130;
					// if (window.screen.availWidth > 640) {
					// 	document.getElementsByClassName('frame-two')[0].scrollTop = resourcesScrollTop;
					// }
					
					FlowRouter.go('/planning/students/view/3/' + studentId);
				}
			});

			return false;
		}
	});
});

Template.studentsNew.helpers({
	selectedStudentId: function() {
		return Session.get('selectedStudentId');
	},
});

Template.studentsNew.events({
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

	'submit .js-form-students-new'(event) {
		event.preventDefault();
	},

	'click .js-cancel'(event) {
		event.preventDefault();

		if (window.screen.availWidth > 640 && FlowRouter.getRouteName() === 'resourcesNew') {
			let resourcesScrollTop = document.getElementById(Session.get('selectedStudentId')).getBoundingClientRect().top - 130;
			document.getElementsByClassName('frame-two')[0].scrollTop = resourcesScrollTop;
		}

		if (window.screen.availWidth > 768) {
			FlowRouter.go('/planning/students/view/3/' + Session.get('selectedStudentId'))
		} else {
			FlowRouter.go('/planning/students/view/2/' + Session.get('selectedStudentId'))
		}
		
	},
});