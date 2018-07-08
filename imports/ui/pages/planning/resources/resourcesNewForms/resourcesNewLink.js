import {Template} from 'meteor/templating';

import autosize from 'autosize';
import './resourcesNewLink.html';

Template.resourcesNewLink.onCreated( function() {
	Session.set('selectedResourceNewType', FlowRouter.getParam('selectedResourceNewType'));
	Session.set('selectedResourceType', 'all');
	Session.set('selectedResourceAvailability', 'all');
	Session.set('selectedResourceId', InitialIds.findOne().resourceAllAll);
	Session.set('selectedResourceCurrentType', InitialIds.findOne().resourceCurrentType);
});

Template.resourcesNewLink.onRendered( function() {
	Session.set('selectedResourceNewType', FlowRouter.getParam('selectedResourceNewType'));
	
	Session.set({
		toolbarType: 'new',
		labelThree: 'New Link Resource',
		selectedFramePosition: 3,
		selectedFrameClass: 'frame-position-three',
		activeNav: 'planningList',
	});

	// Textarea Autoresize
	autosize($('#description'));

	// Form Validation and Submission
	$('.js-form-resources-link-new').validate({
		rules: {
			title: { required: true },
			link: { url: true },
		},
		messages: {
			title: { required: "Required." },
			link: { url: "Please enter a valid url. ex: http://www.amazon.com" },
		},		

		submitHandler() {
			$('.js-saving').show();
			$('.js-submit').prop('disabled', true);

			const resourceProperties = {
				type: 'link',
				searchIndex: [],
				title: event.target.title.value.trim(),
				link: event.target.link.value.trim(),
				description: event.target.description.value.trim(),
				availability: 'own',
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
					FlowRouter.go('/planning/resources/view/all/all/' + resourceId +'/link');
				}
			});

			return false;
		}
	});
});

Template.resourcesNewLink.helpers({
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

Template.resourcesNewLink.events({
	'submit .js-form-resources-link-new'(event) {
		event.preventDefault();
	},
});