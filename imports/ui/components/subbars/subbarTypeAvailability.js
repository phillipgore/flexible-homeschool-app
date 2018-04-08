import {Template} from 'meteor/templating';
import './subbarTypeAvailability.html';

Template.subbarTypeAvailability.onCreated( function() {
	// Subscriptions
	let template = Template.instance();

	Session.set('selectedType', {_id: 'all-types', label: 'All Types'});
	Session.set('selectedAvailability', {_id: 'all-availabilities', label: 'All Availabilities'});
});

Template.subbarTypeAvailability.helpers({
	types: [
		{_id: 'all-types', label: 'All Types'},
		{_id: 'book', label: 'Book'},
		{_id: 'link', label: 'Link'},
		{_id: 'video', label: 'Video'},
		{_id: 'audio', label: 'Audio'},
		{_id: 'app', label: 'App'},
	],

	availabilities: [
		{_id: 'all-availabilities', label: 'All Availabilities'},
		{_id: 'own', label: 'I Own It'},
		{_id: 'borrowed', label: 'I Borrowed It'},
		{_id: 'need', label: 'I Need It'},
	],

	selectedType: function() {
		return Session.get('selectedType');
	},

	selectedAvailability: function() {
		return Session.get('selectedAvailability');
	},

	activeListItem: function(currentItem, item) {
		if (currentItem === item) {
			return true;
		}
		return false;
	},
});

Template.subbarTypeAvailability.events({
	'click .js-types'(event) {
		event.preventDefault();

		let typeId = $(event.currentTarget).attr('id');
		let types = [
			{_id: 'all-types', label: 'All Types'},
			{_id: 'book', label: 'Book'},
			{_id: 'link', label: 'Link'},
			{_id: 'video', label: 'Video'},
			{_id: 'audio', label: 'Audio'},
			{_id: 'app', label: 'App'},
		];
		let typeIds = types.map(type => (type._id));
		Session.set('selectedType', types[typeIds.indexOf(typeId)]);
	},

	'click .js-availabilities'(event) {
		event.preventDefault();

		let availabilityId = $(event.currentTarget).attr('id');
		let availabilities = [
			{_id: 'all-availabilities', label: 'All Availabilities'},
			{_id: 'own', label: 'I Own It'},
			{_id: 'borrowed', label: 'I Borrowed It'},
			{_id: 'need', label: 'I Need It'},
		];
		let availabilityIds = availabilities.map(availability => (availability._id));
		Session.set('selectedAvailability', availabilities[availabilityIds.indexOf(availabilityId)]);
	},
});