import {Template} from 'meteor/templating';
import { StudentGroups } from '../../../../../api/studentGroups/studentGroups.js';
import { Students } from '../../../../../api/students/students.js';

import {requiredValidation} from '../../../../../modules/functions';
import './studentGroupsEdit.html';

Template.studentGroupsEdit.onCreated( function() {	
    this.groupData = this.subscribe('studentGroup', FlowRouter.getParam('selectedStudentGroupId'));
	this.studentData = this.subscribe('allStudents');
});

Template.studentGroupsEdit.onRendered( function() {
	
})

Template.studentGroupsEdit.helpers({
    studentGroup: function() {
        return StudentGroups.findOne({_id: FlowRouter.getParam('selectedStudentGroupId')});
    },
	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}});
	},
    isChecked: function (studentIds, studentId) {
        if (studentIds.includes(studentId)) {
            return true;
        }
        return false;
    },
});

Template.studentGroupsEdit.events({
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

    'submit .js-form-student-groupings-update'(event, template) {
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
            let studentIds = []
            $("[name='studentId']:checked").each(function() {
                studentIds.push(this.id)
            });

			let studentGroupProperties = {
				name: $("[name='name']").val().trim(),
				studentIds: studentIds
			}

            Meteor.call('updateStudentGroup', FlowRouter.getParam('selectedStudentGroupId'), studentGroupProperties, function(error, selectedStudentGroupId) {
                if (error) {
                    Alerts.insert({
                        colorClass: 'bg-danger',
                        iconClass: 'icn-danger',
                        message: error.reason,
                    });
                    
                    $('.js-saving').hide();
                    $('.js-submit').prop('disabled', false);
                } else {
                    Session.set('selectedStudentIdType', 'studentgroups');
                    Session.set('selectedStudentGroupId', selectedStudentGroupId);
                    FlowRouter.go('/planning/studentGroups/view/3/' + selectedStudentGroupId);
                }
            });
        }
    },

	'click .js-cancel'(event) {
		event.preventDefault();

		if (window.screen.availWidth > 768) {
			FlowRouter.go('/planning/studentGroups/view/3/' + FlowRouter.getParam('selectedStudentGroupId'))
		} else {
			FlowRouter.go('/planning/studentGroups/view/2/' + FlowRouter.getParam('selectedStudentGroupId'))
		}
	},
});