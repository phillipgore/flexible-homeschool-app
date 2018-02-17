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
		editUrl: '',
		deleteClass: 'js-delete-resource',
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.resourcesView.helpers({
	resource: function() {
		return Resources.findOne({_id: FlowRouter.getParam('id')});
	},

	resourceIcon: function(resource) {
		if (resource === 'app') {
			return 'fss-app';
		}
		if (resource === 'audio') {
			return 'fss-audio';
		}
		if (resource === 'book') {
			return 'fss-book';
		}
		if (resource === 'link') {
			return 'fss-link';
		}
		if (resource === 'video') {
			return 'fss-video';
		}
	},

	dynamicToolbarEditUrl: function() {
		let resouce = Resources.findOne({_id: FlowRouter.getParam('id')});
		return resouce && '/planning/resources/edit/' + FlowRouter.getParam('id') + '/' + resouce.type;
	},

	availabilityStatment: function(availability) {
		if (availability === 'own') {
			return 'I have it.'
		}
		if (availability === 'borrow') {
			return 'I can borrow it.'
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
			confirmClass: 'js-delete-resource-confirmed',
		});
	},

	'click .js-delete-resource-confirmed'(event) {
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





