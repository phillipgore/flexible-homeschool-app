import {Template} from 'meteor/templating';
import './studentsEach.html';

Template.studentsEach.onRendered( function() {
	let resourcesScrollTop = document.getElementById(FlowRouter.getParam('selectedStudentId')).getBoundingClientRect().top - 130;
	if (window.screen.availWidth > 640) {
		Session.set('resourcesScrollTop', resourcesScrollTop);
		document.getElementsByClassName('frame-two')[0].scrollTop = resourcesScrollTop;
	}
});

Template.studentsEach.helpers({
	active: function(id) {
		if (FlowRouter.getParam('selectedStudentId') === id) {
			return true;
		}
		return false;
	},
});