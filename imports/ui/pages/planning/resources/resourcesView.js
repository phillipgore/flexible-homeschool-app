import {Template} from 'meteor/templating';
import { Resources } from '../../../../api/resources/resources.js';
import './resourcesView.html';

Template.resourcesView.onCreated( function() {
	// Subscriptions
	this.subscribe('resource', FlowRouter.getParam('id'));
});

Template.resourcesView.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '/planning/resources/list',
		leftIcon: 'fss-back',
		label: '',
		editUrl: '/planning/resources/edit/' + FlowRouter.getParam('id'),
		deleteClass: 'js-delete-resource'
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.resourcesView.helpers({
	resource: function() {
		return Resources.findOne({_id: FlowRouter.getParam('id')});
	},
	
	dynamicToolbarLabel: function() {
		let resouce = Resources.findOne({_id: FlowRouter.getParam('id')});
		return resouce && resouce.title;
	},

	availabilityStatment: function(availability) {
		if (availability === 'own') {
			return 'I have it.'
		}
		if (availability === 'library') {
			return 'The Library has it.'
		}
		return 'I need it.'
	}
});

Template.resourcesView.events({
	'click .js-delete-resource'(event) {
		event.preventDefault();

		Dialogs.insert({
			heading: 'Confirmation',
			message: 'Are you sure you want to delete this Resource?',
		});
	},

	'click .js-dialog-confirmed'(event) {
		event.preventDefault();
		const dialogId = Dialogs.findOne()._id;
		Meteor.call('deleteResource', FlowRouter.getParam('id'), function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
			} else {
				Dialogs.remove({_id: dialogId});
				FlowRouter.go('/planning/resources/list');
			}
		});
	}
});





