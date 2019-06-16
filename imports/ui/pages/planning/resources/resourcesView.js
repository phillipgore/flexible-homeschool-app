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
			return 'icn-app';
		}
		if (resource === 'audio') {
			return 'icn-audio';
		}
		if (resource === 'book') {
			return 'icn-book';
		}
		if (resource === 'link') {
			return 'icn-link';
		}
		if (resource === 'video') {
			return 'icn-video';
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
		if (availability === 'need') {
			return 'I need it.'
		}
		return 'I returned it.'
	}
});

Template.resourcesView.events({
	
});





