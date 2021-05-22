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
        return StudentGroups.findOne({_id: FlowRouter.getParam('selectedStudentGroupId')})
    },
	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}});
	},
    isChecked: function (studentGroupIds, groupId) {
        if (studentGroupIds.includes(groupId)) {
            return true;
        }
        return false;
    },
});

Template.studentGroupsEdit.events({
	'click .js-cancel'(event) {
		event.preventDefault();

		if (window.screen.availWidth > 768) {
			FlowRouter.go('/planning/studentGroups/view/3/' + FlowRouter.getParam('selectedStudentGroupId'))
		} else {
			FlowRouter.go('/planning/studentGroups/view/2/' + FlowRouter.getParam('selectedStudentGroupId'))
		}

	},
});