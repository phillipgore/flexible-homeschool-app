import {Template} from 'meteor/templating';
import './studentsEach.html';

Template.studentsEach.onRendered( function() {
	let newScrollTop = document.getElementById(FlowRouter.getParam('selectedStudentId')).getBoundingClientRect().top - 130;
	if (window.screen.availWidth > 640) {
		document.getElementsByClassName('frame-two')[0].scrollTop = newScrollTop;
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