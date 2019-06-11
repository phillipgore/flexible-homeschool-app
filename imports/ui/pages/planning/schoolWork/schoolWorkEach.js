import {Template} from 'meteor/templating';
import './schoolWorkEach.html';

Template.schoolWorkEach.onRendered( function() {
	let newScrollTop = document.getElementById(FlowRouter.getParam('selectedSchoolWorkId')).getBoundingClientRect().top - 130;
	if (window.screen.availWidth > 640) {
		document.getElementsByClassName('frame-two')[0].scrollTop = newScrollTop;
	}
});

Template.schoolWorkEach.helpers({
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