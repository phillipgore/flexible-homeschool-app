import {Template} from 'meteor/templating';
import { Resources } from '../../../../api/resources/resources.js';
import './resourcesList.html';

import _ from 'lodash'

Template.resourcesList.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		this.resourceData = Meteor.subscribe('scopedResources', FlowRouter.getParam('selectedResourceType'), FlowRouter.getParam('selectedResourceAvailability'));
		Meteor.subscribe('resourceStats');
	});

	Session.set('selectedResourceAvailability', FlowRouter.getParam('selectedResourceAvailability'));
	Session.set('selectedResourceType', FlowRouter.getParam('selectedResourceType'));
});

Template.resourcesList.onRendered( function() {
	Session.set({
		labelTwo: 'Resources',
		activeNav: 'planningList',
	});
});

Template.resourcesList.helpers({
	subscriptionReady: function() {
		return Template.instance().resourceData.ready();
	},

	resources: function() {
		return Resources.find({}, {sort: {title: 1}});
	},

	selectedResourceType: function() {
		return FlowRouter.getParam('selectedResourceType');
	},

	selectedResourceAvailability: function() {
		return FlowRouter.getParam('selectedResourceAvailability');
	},

	selectedResourceCurrentTypeId: function() {
		return FlowRouter.getParam('selectedResourceCurrentTypeId');
	},

	selectedResourceNewType: function() {
		return Session.get('selectedResourceNewType');
	},

	resourceCount: function(type, availability) {
		return Counts.get(type + _.capitalize(availability) + 'Count');
	},

	isLink: function(type) {
		if (type === 'link') {
			return true;
		}
		return false;
	},

	availability: function(availability) {
		if (availability === 'own') {
			return 'txt-royal'
		}
		if (availability === 'borrowed') {
			return 'txt-info'
		}
		if (availability === 'need') {
			return 'txt-warning'
		}
	},

	availabilityText: function(availability) {
		if (availability === 'own') {
			return '(Own It)'
		}
		if (availability === 'borrowed') {
			return '(Borrowed It)'
		}
		if (availability === 'need') {
			return '(Need It)'
		}
	},

	activeRoute: function(currentRoute, route) {
		if (currentRoute === route) {
			return true;
		}
		return false;
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedResourceId') === id) {
			return true;
		}
		return false;
	},
});

Template.resourcesList.events({
	'click .js-resouce-availability-btn'(event) {
		event.preventDefault();

		let resourceId = $(event.currentTarget).attr('data-resource-id');
		let selectedAvailability = $(event.currentTarget).attr('id');

		$('#resource' + resourceId).find('.list-item-dropdown').hide();
		$('#resource' + resourceId).find('.list-item-dropdown-loader').show();

		const resourceProperties = {
			availability: selectedAvailability,
		};

		function newResourceId(currentResourceId) {
			let sessionResourceIdName = 'selectedResource' + _.capitalize(FlowRouter.getParam('selectedResourceType')) + _.capitalize(FlowRouter.getParam('selectedResourceAvailability')) + 'Id';
			let resourceIds = Resources.find({}, {sort: {title: 1}}).map(resource => (resource._id));
			let currentResourcePosition = resourceIds.indexOf(currentResourceId);

			if (currentResourceId != Session.get(sessionResourceIdName)) {
				return Session.get(sessionResourceIdName);
			}
			if (currentResourcePosition === 0 && currentResourcePosition + 1 === resourceIds.length) {
				return 'empty';
			}
			if (currentResourcePosition === 0) {
				return resourceIds[currentResourcePosition + 1]
			}
			return resourceIds[currentResourcePosition - 1]
		}

		let newResource = Resources.findOne({_id: newResourceId(resourceId)});

		Meteor.call('updateResource', resourceId, resourceProperties, function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
				
				$('#resource' + resourceId).find('.list-item-dropdown-loader').hide();
				$('#resource' + resourceId).find('.list-item-dropdown').show();
			} else {
				$('#dropdown' + resourceId).fadeOut(100).removeAttr('style');
				$('#resource' + resourceId).find('.list-item-dropdown-loader').hide();
				$('#resource' + resourceId).find('.list-item-dropdown').show();

				FlowRouter.go('/planning/resources/view/2/' + FlowRouter.getParam('selectedResourceType') +'/'+ FlowRouter.getParam('selectedResourceAvailability') +'/'+ newResource._id +'/'+ newResource.type );
			}
		});

		return false;
	}
});