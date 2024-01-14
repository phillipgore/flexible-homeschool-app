import {Template} from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Students } from '../../../../api/students/students.js';
import './studentsEach.html';

Template.studentsEach.onCreated( function() {
	Session.setPersistent('unScrolled', true);
});

Template.studentsEach.onRendered( function() {
	
});

Template.studentsEach.helpers({
	scroll: function() {
		if (Session.get('unScrolled') && Students.find({_id: FlowRouter.getParam('selectedStudentId')}).count()) {
			setTimeout(function() {
				let newScrollTop = document.getElementById(FlowRouter.getParam('selectedStudentId')).getBoundingClientRect().top - 130;
				if (window.screen.availWidth > 640) {
					document.getElementsByClassName('frame-two')[0].scrollTop = newScrollTop;
				}
				Session.setPersistent('unScrolled', false);
				return false;
			}, 100);
		}
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedStudentId') === id) {
			return true;
		}
		return false;
	},
});