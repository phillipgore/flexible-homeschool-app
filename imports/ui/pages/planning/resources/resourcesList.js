import {Template} from 'meteor/templating';
import { Resources } from '../../../../api/resources/resources.js';
import './resourcesList.html';

Template.resourcesList.onCreated( function() {
	// Subscriptions\
	this.subscribe('allResources');
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
});

Template.resourcesList.events({
	
});