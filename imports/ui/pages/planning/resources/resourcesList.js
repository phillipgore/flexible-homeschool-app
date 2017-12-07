import {Template} from 'meteor/templating';
import { Resources } from '../../../../api/resources/resources.js';
import './resourcesList.html';

Template.resourcesList.onRendered( function() {
	// Subscriptions
	Meteor.subscribe('allResources');

	// Toolbar Settings
	Session.set({
		leftUrl: '/planning/list',
		leftIcon: 'fss-btn-back',
		leftCaret: false,
		label: 'Resources',
		rightUrl: '/planning/resources/new',
		rightIcon: 'fss-btn-new',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.resourcesList.helpers({
	resources: function() {
		return Resources.find({}, {sort: {title: 1}});
	},
});

Template.resourcesList.events({
	
});