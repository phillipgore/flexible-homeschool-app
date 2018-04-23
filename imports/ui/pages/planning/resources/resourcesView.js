import {Template} from 'meteor/templating';
import { Resources } from '../../../../api/resources/resources.js';
import './resourcesView.html';

Template.resourcesView.onCreated( function() {
	// Subscriptions
	this.subscribe('resource', FlowRouter.getParam('selectedResourceId'));
});

Template.resourcesView.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '/planning/resources/list/' + Session.get('selectedResourceType') +'/'+ Session.get('selectedResourceAvailability'),
		leftIcon: 'fss-back',
		label: 'Resource',
		editUrl: '',
		deleteClass: 'js-delete-resource',
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.resourcesView.helpers({
	resource: function() {
		return Resources.findOne({_id: FlowRouter.getParam('selectedResourceId')});
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

	resourceOrigin: function(firstName, lastName) {
		if (firstName || lastName) {
			return true;
		}
		return false;
	},

	dynamicToolbarEditUrl: function() {
		let resouce = Resources.findOne({_id: FlowRouter.getParam('selectedResourceId')});
		return resouce && '/planning/resources/edit/' + FlowRouter.getParam('selectedResourceId') + '/' + resouce.type;
	},

	availabilityStatment: function(availability) {
		if (availability === 'own') {
			return 'I have it.'
		}
		if (availability === 'borrowed') {
			return 'I borrowed it.'
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
		Meteor.call('deleteResource', FlowRouter.getParam('selectedResourceId'), function(error) {
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





