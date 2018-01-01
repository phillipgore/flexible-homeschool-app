import {Template} from 'meteor/templating';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../../api/terms/terms.js';
import './schoolYearsView.html';

Template.schoolYearsView.onCreated( function() {
	// Subscriptions
	this.subscribe('schoolYear', FlowRouter.getParam('id'));
	this.subscribe('schoolYearsTerms', FlowRouter.getParam('id'));

});

Template.schoolYearsView.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '/planning/schoolYears/list',
		leftIcon: 'fss-back',
		label: '',
		editUrl: '/planning/schoolyears/edit/' + FlowRouter.getParam('id'),
		deleteClass: 'js-delete-school-year'
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.schoolYearsView.helpers({
	schoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('id')});
	},

	terms: function() {
		return Terms.find({schoolYearId: FlowRouter.getParam('id')})
	},
	
	dynamicToolbarLabel: function() {
		let schoolYears = SchoolYears.findOne({_id: FlowRouter.getParam('id')});
		return schoolYears && schoolYears.startYear +"-"+ schoolYears.endYear;
	},
});

Template.schoolYearsView.events({
	'click .js-delete-school-year'(event) {
		event.preventDefault();

		Dialogs.insert({
			heading: 'Confirmation',
			message: 'Are you sure you want to delete this School Year?',
		});
	},

	'click .js-dialog-confirmed'(event) {
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





