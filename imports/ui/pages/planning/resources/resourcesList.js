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
		let typeId = Session.get('selectedType') && Session.get('selectedType')._id;
		let availabilityId = Session.get('selectedAvailability') && Session.get('selectedAvailability')._id;
		if (typeId === 'all-types' && availabilityId != 'all-availabilities') {
			return Resources.find({availability: availabilityId}, {sort: {title: 1}});
		}
		if (typeId != 'all-types' && availabilityId === 'all-availabilities') {
			return Resources.find({type: typeId}, {sort: {title: 1}});
		}
		if (typeId === 'all-types' && availabilityId === 'all-availabilities') {
			return Resources.find({}, {sort: {title: 1}});
		}
		return Resources.find({type: typeId, availability: availabilityId}, {sort: {title: 1}});
	},
});

Template.resourcesList.events({
	
});