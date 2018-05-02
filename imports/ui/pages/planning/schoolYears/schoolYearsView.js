import {Template} from 'meteor/templating';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Weeks } from '../../../../api/weeks/weeks.js';
import './schoolYearsView.html';

Template.schoolYearsView.onCreated( function() {
	// Subscriptions
	Tracker.autorun(() => {
		this.schoolYearData = Meteor.subscribe('schoolYearComplete', FlowRouter.getParam('selectedSchoolYearId'));
	});
});

Template.schoolYearsView.onRendered( function() {
	// Toolbar Settings
	Session.set({
		label: 'School Year',
		editUrl: '/planning/schoolyears/edit/' + FlowRouter.getParam('selectedSchoolYearId'),
		deleteClass: 'js-delete-school-year',
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
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
		let weekCount = Weeks.find({termId: termId}).fetch().length;
		if (weekCount === 1) {
			return weekCount + ' Week';
		}
		return weekCount + ' Weeks';
	},
});

Template.schoolYearsView.events({
	'click .js-delete-school-year'(event) {
		event.preventDefault();

		Dialogs.insert({
			heading: 'Confirmation',
			message: 'Are you sure you want to delete this School Year?',
			confirmClass: 'js-delete-school-year-confirmed',
		});
	},

	'click .js-delete-school-year-confirmed'(event) {
		event.preventDefault();
		const dialogId = Dialogs.findOne()._id;
		Dialogs.remove({_id: dialogId});
		Meteor.call('deleteSchoolYear', FlowRouter.getParam('selectedSchoolYearId'), function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
			} else {
				Dialogs.remove({_id: dialogId});
				FlowRouter.go('/planning/schoolyears/list');
			}
		});
	}
});





