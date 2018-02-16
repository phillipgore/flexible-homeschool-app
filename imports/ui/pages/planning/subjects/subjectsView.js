import {Template} from 'meteor/templating';
import { Subjects } from '../../../../api/subjects/subjects.js';
import './subjectsView.html';

Template.subjectsView.onCreated( function() {
	// Subscriptions
	this.subscribe('subject', FlowRouter.getParam('id'));
});

Template.subjectsView.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '/planning/subjects/list',
		leftIcon: 'fss-back',
		label: 'Subject',
		editUrl: '/planning/subjects/edit/' + FlowRouter.getParam('id'),
		deleteClass: 'js-delete-subject',
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.subjectsView.helpers({
	subject: function() {
		return Subjects.findOne({_id: FlowRouter.getParam('id')});
	},
});

Template.subjectsView.events({
	'click .js-delete-subject'(event) {
		event.preventDefault();

		Dialogs.insert({
			heading: 'Confirmation',
			message: 'Are you sure you want to delete this Subject?',
			confirmClass: 'js-delete-subject-confirmed',
		});
	},

	'click .js-delete-subject-confirmed'(event) {
		event.preventDefault();
		const dialogId = Dialogs.findOne()._id;
		Dialogs.remove({_id: dialogId});
		Meteor.call('deleteSubject', FlowRouter.getParam('id'), function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
			} else {
				Dialogs.remove({_id: dialogId});
				FlowRouter.go('/planning/subjects/list');
			}
		});
	}
});





