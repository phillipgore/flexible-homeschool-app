import {Template} from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Weeks } from '../../../../api/weeks/weeks.js';
import './schoolYearsView.html';

Template.schoolYearsView.onCreated( function() {
	// Subscriptions
	let template = Template.instance();
	
	template.autorun(() => {
		this.schoolYearData = Meteor.subscribe('schoolYearView', FlowRouter.getParam('selectedSchoolYearId'));
	});
});

Template.schoolYearsView.onRendered( function() {
	Session.set({
		toolbarType: 'schoolYear',
		editUrl: '/planning/schoolyears/edit/3/' + FlowRouter.getParam('selectedSchoolYearId'),
		labelThree: 'School Year',
		activeNav: 'planningList',
	});
});

Template.schoolYearsView.helpers({
	subscriptionReady: function() {
		return Template.instance().schoolYearData.ready();
	},
	
	schoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')});
	},

	terms: function() {
		return Terms.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId')});
	},

	termWeeks: function(termId) {
		let weekCount = Weeks.find({termId: termId}).count();
		if (weekCount === 1) {
			return weekCount + ' Week';
		}
		return weekCount + ' Weeks';
	},
});

Template.schoolYearsView.events({
	
});





