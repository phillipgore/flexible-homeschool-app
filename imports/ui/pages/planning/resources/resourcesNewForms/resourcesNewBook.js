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
		selectedFramePosition: 3,
		selectedFrameClass: 'frame-position-three',
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

			Meteor.call('insertResource', resourceProperties, function(error, resourceId) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: error.reason,
					});
					
					$('.js-loading').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					Session.set('selectedResourceId', resourceId);
					FlowRouter.go('/planning/resources/view/all/all/' + resourceId +'/book');
				}
			});

			return false;
		}
	});
});

Template.resourcesNewBook.helpers({
	
});

Template.resourcesNewBook.events({
	'submit .js-form-resources-book-new'(event) {
		event.preventDefault();
	},

	'click .js-cancel'(event) {
		event.preventDefault();
		
		Session.setPersistent('selectedFramePosition', 2);
		Session.setPersistent('selectedFrameClass', 'frame-position-two');
		FlowRouter.go('/planning/resources/view/' + Session.get('selectedResourceType') +'/'+ Session.get('selectedResourceAvailability') +'/'+ Session.get('selectedResourceId') +'/'+ Session.get('selectedResourceCurrentTypeId'));
	},
});