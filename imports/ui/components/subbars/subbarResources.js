import {Template} from 'meteor/templating';
import './subbarResources.html';

import _ from 'lodash'
InitialResourceIds = new Mongo.Collection('initialResourceIds');

Template.subbarResources.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		this.subscribe('initialResourceIds')
	});
});

Template.subbarResources.helpers({
	types: [
		{_id: 'all', label: 'All Types'},
		{_id: 'book', label: 'Book'},
		{_id: 'link', label: 'Link'},
		{_id: 'video', label: 'Video'},
		{_id: 'audio', label: 'Audio'},
		{_id: 'app', label: 'App'},
	],

	availabilities: [
		{_id: 'all', label: 'All Availabilities'},
		{_id: 'own', label: 'I Own It'},
		{_id: 'borrowed', label: 'I Borrowed It'},
		{_id: 'need', label: 'I Need It'},
	],

	resourceCount: function(type, availability) {
		return Counts.get(type + _.capitalize(availability) + 'Count');
	},

	selectedResourceType: function() {
		return Session.get('selectedResourceType');
	},

	selectedResourceAvailability: function() {
		return Session.get('selectedResourceAvailability');
	},

	selectedResourceCurrentTypeId: function() {
		return Session.get('selectedResourceCurrentTypeId');
	},

	typeLabel: function(type) {
		if (type === 'all') { return 'All Types' };
		if (type === 'book') { return 'Book' };
		if (type === 'link') { return 'Link' };
		if (type === 'video') { return 'Video' };
		if (type === 'audio') { return 'Audio' };
		if (type === 'app') { return 'App' };
	},

	typeAvailabilityResourceId: function(type, availability) {
		let resourceIds = InitialResourceIds.findOne();
		let key = 'resource' + _.capitalize(type) + _.capitalize(availability);
		return resourceIds[key];
	},

	typeAvailability: function(type, availability) {
		if (Counts.get(type + 'AllCount')) {
			return 'txt-primary'
		}
		return 'txt-gray-darker'
	},

	availabilityLabel: function(type) {
		if (type === 'all') { return 'All Availabilities' };
		if (type === 'own') { return 'I Own It' };
		if (type === 'borrowed') { return 'I Borrowed It' };
		if (type === 'need') { return 'I Need It' };
	},

	availabilityStatus: function(type, availability) {
		if (availability === 'all' && Counts.get(type + _.capitalize(availability) +'Count')) {
			return 'txt-primary'
		}
		if (availability === 'own' && Counts.get(type + _.capitalize(availability) +'Count')) {
			return 'txt-royal'
		}
		if (availability === 'borrowed' && Counts.get(type + _.capitalize(availability) +'Count')) {
			return 'txt-info'
		}
		if (availability === 'need' && Counts.get(type + _.capitalize(availability) +'Count')) {
			return 'txt-warning'
		}
		return 'txt-gray-darker'
	},

	typeIsAll: function(type) {
		if (type === 'all') {
			return true;
		}
		return false;
	},

	activeListItem: function(currentItem, item) {
		if (currentItem === item) {
			return true;
		}
		return false;
	},
});









