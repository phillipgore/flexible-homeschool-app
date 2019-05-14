import {Template} from 'meteor/templating';
import './schoolWorkEach.html';

Template.schoolWorkEach.onRendered( function() {
	let resourcesScrollTop = document.getElementById(FlowRouter.getParam('selectedSchoolWorkId')).getBoundingClientRect().top - 130;
	if (window.screen.availWidth > 640) {
		Session.set('resourcesScrollTop', resourcesScrollTop);
		document.getElementsByClassName('frame-two')[0].scrollTop = resourcesScrollTop;
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