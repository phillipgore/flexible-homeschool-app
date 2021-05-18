import {Template} from 'meteor/templating';
import { StudentGroups } from '../../../../../api/studentGroups/studentGroups.js';
import { Students } from '../../../../../api/students/students.js';
import './studentGroupsView.html';

Template.studentGroupsView.onCreated( function() {	
	
});

Template.studentGroupsView.onRendered( function() {
	// Toolbar Settings
	Session.set({
		toolbarType: 'student',
		editUrl: '/planning/studentGroups/edit/3/' + FlowRouter.getParam('selectedStudentGroupId'),
		labelThree: 'Student Group',
		activeNav: 'planningList',
	});
});

Template.studentGroupsView.helpers({
	studentGroup: function() {
		return StudentGroups.findOne({_id: FlowRouter.getParam('selectedStudentGroupId')});
	},

	groupStudents: function(studentGroupId) {
		console.log(studentGroupId);
		return Students.find({studentGroupIds: studentGroupId});
	},
});

Template.studentGroupsView.events({
	
});





