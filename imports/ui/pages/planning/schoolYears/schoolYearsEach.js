import {Template} from 'meteor/templating';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import './schoolYearsEach.html';


Template.schoolYearsEach.onCreated( function() {
	Session.setPersistent('unScrolled', true);
});

Template.schoolYearsEach.onRendered( function() {
	
});

Template.schoolYearsEach.helpers({
	scroll: function() {
		if (Session.get('unScrolled') && SchoolYears.find({_id: FlowRouter.getParam('selectedSchoolYearId')}).count()) {
			setTimeout(function() {
				let newScrollTop = document.getElementById(FlowRouter.getParam('selectedSchoolYearId')).getBoundingClientRect().top - 130;
				if (window.screen.availWidth > 640) {
					document.getElementsByClassName('frame-two')[0].scrollTop = newScrollTop;
				}
				Session.setPersistent('unScrolled', false);
				return false;
			}, 300);
		}
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedSchoolYearId') === id) {
			return true;
		}
		return false;
	},
});