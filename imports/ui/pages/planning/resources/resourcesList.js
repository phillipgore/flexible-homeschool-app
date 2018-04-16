import {Template} from 'meteor/templating';
import { Resources } from '../../../../api/resources/resources.js';
import './resourcesList.html';

import _ from 'lodash'

Template.resourcesList.onCreated( function() {
	// Subscriptions\
	if (FlowRouter.getParam('selectedResourceType') === 'link') {
		this.subscribe('scopedResources', FlowRouter.getParam('selectedResourceType'), 'all');
		Session.set('selectedResourceAvailability', 'all');
	} else {
		this.subscribe('scopedResources', FlowRouter.getParam('selectedResourceType'), FlowRouter.getParam('selectedResourceAvailability'));
		Session.set('selectedResourceAvailability', FlowRouter.getParam('selectedResourceAvailability'));
	}
	this.subscribe('resourceStats');

	Session.set('selectedResourceType', FlowRouter.getParam('selectedResourceType'));
});

Template.resourcesList.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '/planning/list',
		leftIcon: 'fss-back',
		label: 'Resources',
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.resourcesList.helpers({
	resources: function() {
		return Resources.find({}, {sort: {title: 1}});
	},

	selectedResourceType: function() {
		return FlowRouter.getParam('selectedResourceType');
	},

	selectedResourceAvailability: function() {
		return Session.get('selectedResourceAvailability');
	},

	resourceCount: function(type, availability) {
		return Counts.get(type + _.capitalize(availability) + 'Count');
	},
});