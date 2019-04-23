import {Template} from 'meteor/templating';
import './schoolYearsEach.html';

Template.schoolYearsEach.onRendered( function() {
	let resourcesScrollTop = document.getElementById(FlowRouter.getParam('selectedSchoolYearId')).getBoundingClientRect().top - 130;
	if (window.screen.availWidth > 640) {
		Session.set('resourcesScrollTop', resourcesScrollTop);
		document.getElementsByClassName('frame-two')[0].scrollTop = resourcesScrollTop;
	}
});

Template.schoolYearsEach.helpers({
	active: function(id) {
		if (FlowRouter.getParam('selectedSchoolYearId') === id) {
			return true;
		}
		return false;
	},
});