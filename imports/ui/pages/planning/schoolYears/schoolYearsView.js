import {Template} from 'meteor/templating';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Weeks } from '../../../../api/weeks/weeks.js';
import './schoolYearsView.html';

Template.schoolYearsView.onCreated( function() {
	// Subscriptions
	this.subscribe('schoolYearComplete', FlowRouter.getParam('id'));
});

Template.schoolYearsView.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '/planning/schoolYears/list',
		leftIcon: 'fss-back',
		label: 'School Year',
		editUrl: '/planning/schoolyears/edit/' + FlowRouter.getParam('id'),
		deleteClass: 'js-delete-school-year',
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.schoolYearsView.helpers({
	schoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('id')});
	},

	terms: function() {
		return Terms.find({schoolYearId: FlowRouter.getParam('id')});
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
		Meteor.call('deleteSchoolYear', FlowRouter.getParam('id'), function(error) {
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





