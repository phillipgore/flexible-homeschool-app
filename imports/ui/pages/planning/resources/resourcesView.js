import {Template} from 'meteor/templating';
import { Resources } from '../../../../api/resources/resources.js';
import './resourcesView.html';

Template.resourcesView.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		this.resourceData = Meteor.subscribe('resource', FlowRouter.getParam('selectedResourceId'));
	});
});

Template.resourcesView.onRendered( function() {
	// Toolbar Settings
	Session.set({
		toolbarType: 'resource',
		editUrl: '/planning/resources/edit/3/' + FlowRouter.getParam('selectedResourceType') +'/'+ FlowRouter.getParam('selectedResourceAvailability') +'/'+ FlowRouter.getParam('selectedResourceId') +'/'+ FlowRouter.getParam('selectedResourceCurrentTypeId'),
		labelThree: 'Resource',
		activeNav: 'planningList',
	});
});

Template.resourcesView.helpers({
	subscriptionReady: function() {
		return Template.instance().resourceData.ready();
	},
	
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
		return resouce && '/planning/resources/edit/3/' + FlowRouter.getParam('selectedResourceId') + '/' + resouce.type;
	},

	availabilityStatment: function(availability) {
		if (availability === 'own') {
			return 'I own it.'
		}
		if (availability === 'borrowed') {
			return 'I borrowed it.'
		}
		return 'I need it.'
	}
});

Template.resourcesView.events({
	'click .js-delete-resource-confirmed'(event) {
		event.preventDefault();
		$('.js-deleting').show();

		function nextResourceId(selectedResourceId) {
			let resourceIds = Resources.find({}, {sort: {title: 1}}).map(resource => (resource._id));

			if (resourceIds.length > 1) {
				let selectedIndex = resourceIds.indexOf(selectedResourceId);
				if (selectedIndex) {
					return Resources.findOne({_id: resourceIds[selectedIndex - 1]});
				}
				return Resources.findOne({_id: resourceIds[selectedIndex + 1]});
			}
			return {_id: 'empty', type: 'empty'}
		};

		let newResource = nextResourceId(FlowRouter.getParam('selectedResourceId'))
		const dialogId = Dialogs.findOne()._id;

		Dialogs.remove({_id: dialogId});
		Meteor.call('deleteResource', FlowRouter.getParam('selectedResourceId'), function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
			} else {
				Session.set('selectedResourceId', newResource._id);
				FlowRouter.go('/planning/resources/view/2/' + FlowRouter.getParam('selectedResourceType') +'/'+ FlowRouter.getParam('selectedResourceAvailability') +'/'+ newResource._id +'/'+ newResource.type);
				$('.js-deleting').hide();
			}
		});
	}
});





