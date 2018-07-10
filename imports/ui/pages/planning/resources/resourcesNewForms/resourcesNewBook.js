import {Template} from 'meteor/templating';

import autosize from 'autosize';
import './resourcesNewBook.html';

Template.resourcesNewBook.onCreated( function() {
	Session.set('selectedResourceNewType', FlowRouter.getParam('selectedResourceNewType'));
	Session.set('selectedResourceType', 'all');
	Session.set('selectedResourceAvailability', 'all');
	Session.set('selectedResourceId', InitialIds.findOne().resourceAllAll);
	Session.set('selectedResourceCurrentType', InitialIds.findOne().resourceCurrentType);
});

Template.resourcesNewBook.onRendered( function() {
	Session.set('selectedResourceNewType', FlowRouter.getParam('selectedResourceNewType'));
	
	Session.set({
		toolbarType: 'new',
		labelThree: 'New Book Resource',
		
		
		activeNav: 'planningList',
	});

	// Textarea Autoresize
	autosize($('#description'));
	
	// Form Validation and Submission
	$('.js-form-resources-book-new').validate({
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
			$('.js-saving').show();
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

			Meteor.call('insertResource', resourceProperties, function(error, resourceId) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: error.reason,
					});
					
					$('.js-saving').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					Session.set('selectedResourceId', resourceId);
					FlowRouter.go('/planning/resources/view/3/all/all/' + resourceId +'/book');
				}
			});

			return false;
		}
	});
});

Template.resourcesNewBook.helpers({
	selectedResourceType: function() {
		return Session.get('selectedResourceType');
	},

	selectedResourceAvailability: function() {
		return Session.get('selectedResourceAvailability');
	},

	selectedResourceId: function() {
		return Session.get('selectedResourceId');
	},

	selectedResourceCurrentTypeId: function() {
		return Session.get('selectedResourceCurrentTypeId');
	},
});

Template.resourcesNewBook.events({
	'submit .js-form-resources-book-new'(event) {
		event.preventDefault();
	},
});