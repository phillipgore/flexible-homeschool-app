import {Template} from 'meteor/templating';
import { SchoolWork } from '../../../../api/schoolWork/schoolWork.js';
import './schoolWorkEach.html';


Template.schoolWorkEach.onCreated( function() {
	Session.setPersistent('unScrolled', true);
});

Template.schoolWorkEach.onRendered( function() {
	
});

Template.schoolWorkEach.helpers({
	scroll: function() {
		if (Session.get('unScrolled') && SchoolWork.find({_id: FlowRouter.getParam('selectedSchoolWorkId')}).count()) {
			let newScrollTop = document.getElementById(FlowRouter.getParam('selectedSchoolWorkId')).getBoundingClientRect().top - 130;
			if (window.screen.availWidth > 640) {
				document.getElementsByClassName('frame-two')[0].scrollTop = newScrollTop;
			}
			Session.setPersistent('unScrolled', false);
			return false;
		}
	},
	
	selectedStudentId: function() {
		return Session.get('selectedStudentId');
	},

	selectedSchoolYearId: function() {
		return Session.get('selectedSchoolYearId');
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedSchoolWorkId') === id) {
			return true;
		}
		return false;
	},
});