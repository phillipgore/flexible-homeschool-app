import {Template} from 'meteor/templating';
import { Students } from '../../../../api/students/students.js';
import './studentsView.html';

Template.studentsView.onCreated( function() {	
	let template = Template.instance();
	
	template.autorun(() => {
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
	
});





