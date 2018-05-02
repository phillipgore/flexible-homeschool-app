import {Template} from 'meteor/templating';
import { Resources } from '../../../../../api/resources/resources.js';

import autosize from 'autosize';
import './resourcesEditBook.html';

Template.resourcesEditBook.onCreated( function() {
	// Subscriptions
	this.subscribe('resource', FlowRouter.getParam('selectedResourceId'));
});

Template.resourcesEditBook.onRendered( function() {
	// Toolbar Settings
	Session.set({
		label: 'Edit Book Resource',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');

	// Textarea Autoresize
	autosize($('#description'));
	
	// Form Validation and Submission
	$('.js-form-resources-book-edit').validate({
		rules: {
			title: { required: true },
			link: { url: true },
			publicationDate: { date: true },
		},
		messages: {
			title: { required: "Required." },
			link: { url: "Please enter a valid url. ex: http://www.amazon.com" },
			publicationDate: { date: "Please enter a valid date." },
		},		

		submitHandler() {
			$('.js-loading').show();
			$('.js-submit').prop('disabled', true);

			const resourceProperties = {
				type: 'book',
				searchIndex: ['Books', 'KindleStore'],
				title: event.target.title.value.trim(),
				authorFirstName: event.target.authorFirstName.value.trim(),
				authorLastName: event.target.authorLastName.value.trim(),
				availability: event.target.availability.value.trim(),
				link: event.target.link.value.trim(),
				publisher: event.target.publisher.value.trim(),
				publicationDate: event.target.publicationDate.value.trim(),
				description: event.target.description.value.trim(),
			};

			Meteor.call('updateResource', FlowRouter.getParam('selectedResourceId'), resourceProperties, function(error) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: error.reason,
					});
					
					$('.js-loading').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					FlowRouter.go('/planning/resources/view/' + FlowRouter.getParam('selectedResourceId'));
				}
			});

			return false;
		}
	});
});

Template.resourcesEditBook.helpers({
	resource: function() {
		return Resources.findOne();
	},

	availability: function(currentAvailability, availability) {
		if (currentAvailability === availability) {
			return true;
		}
		return false;
	},
});

Template.resourcesEditBook.events({
	'submit .js-form-resources-book-edit'(event) {
		event.preventDefault();
	},
});