import {Template} from 'meteor/templating';
import { Students } from '../../../../api/students/students.js';
import './studentsEach.html';

Template.studentsEach.onCreated( function() {
	Session.setPersistent('unScrolled', true);
});

Template.studentsEach.onRendered( function() {
	
});

Template.studentsEach.helpers({
	scroll: function() {
		if (Session.get('unScrolled') && Meteor.users.find({_id: FlowRouter.getParam('selectedStudentId')}).count()) {
			let newScrollTop = document.getElementById(FlowRouter.getParam('selectedStudentId')).getBoundingClientRect().top - 180;
			if (window.screen.availWidth > 640) {
				document.getElementsByClassName('frame-two')[0].scrollTop = newScrollTop;
			}
			Session.setPersistent('unScrolled', false);
			return false;
		}
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedStudentId') === id) {
			return true;
		}
		return false;
	},
});