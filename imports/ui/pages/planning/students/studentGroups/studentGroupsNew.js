import {Template} from 'meteor/templating';
import { Students } from '../../../../../api/students/students.js';

import {requiredValidation} from '../../../../../modules/functions';
import './studentGroupsNew.html';

Template.studentGroupsNew.onCreated( function() {
    this.studentData = this.subscribe('allStudents');
});

Template.studentGroupsNew.onRendered( function() {

});

Template.studentGroupsNew.helpers({
    students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}});
	},
});

Template.studentGroupsNew.events({
    'keyup #name'(event) {
    	let checkedCount = $('.js-student-id:checked').length;

    	if (requiredValidation($("[name='name']").val().trim())) {
    		$('#name').removeClass('error');
            $('.name-errors').text('');
    	}
	},

    'change .js-student-id'(event) {
    	let checkedCount = $('.js-student-id:checked').length;

    	if ($('.js-student-id:checked').length > 1) {
    		$('.student-errors').text('');
    	}
	},

    'submit .js-form-student-groupings-new'(event, template) {
		event.preventDefault();
        
        let inError = []

        if (!requiredValidation($("[name='name']").val().trim())) {
            $('#name').addClass('error');
            $('.name-errors').text('Required.');
            inError.push('error');
        }

    	if ($('.js-student-id:checked').length <= 1) {
    		$('.student-errors').text('Select at least two Students.');
            inError.push('error');
    	}

        if (inError.length === 0) {
            let groupName = $("[name='name']").val().trim();

            let studentIds = []
            $("[name='studentId']:checked").each(function() {
                studentIds.push(this.id)
            });

            Meteor.call('insertStudentGroup', groupName, studentIds, function(error, studentId) {
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
                    FlowRouter.go('/planning/students/view/3/' + studentId);
                }
            });
        }
    },

	'click .js-cancel'(event) {
		event.preventDefault();

		if (window.screen.availWidth > 768) {
			FlowRouter.go('/planning/studentGroups/view/3/' + Session.get('selectedStudentGroupId'))
		} else {
			FlowRouter.go('/planning/studentGroups/view/2/' + Session.get('selectedStudentGroupId'))
		}
	},
});