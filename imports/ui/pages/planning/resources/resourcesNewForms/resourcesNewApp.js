import {Template} from 'meteor/templating';

import autosize from 'autosize';
import './resourcesNewApp.html';

Template.resourcesNewApp.onCreated( function() {
	Session.set('selectedResourceNewType', FlowRouter.getParam('selectedResourceNewType'));
	Session.set('selectedResourceType', 'all');
	Session.set('selectedResourceAvailability', 'all');
	Session.set('selectedResourceId', InitialIds.findOne().resourceAllAll);
	Session.set('selectedResourceCurrentType', InitialIds.findOne().resourceCurrentType);
});

Template.resourcesNewApp.onRendered( function() {
	Session.set({
		toolbarType: 'new',
		labelThree: 'New App Resource',
		selectedFramePosition: 3,
		selectedFrameClass: 'frame-position-three',
		activeNav: 'planningList',
	});

	// Textarea Autoresize
	autosize($('#description'));

	// Form Validation and Submission
	$('.js-form-resources-app-new').validate({
		rules: {
			title: { required: true },
			link: { url: true },
		},
		messages: {
			title: { required: "Required." },
			link: { url: "Please enter a valid url. ex: http://www.amazon.com" },
		},		

		submitHandler() {
			$('.js-loading').show();
			$('.js-submit').prop('disabled', true);

			const resourceProperties = {
				type: 'app',
				searchIndex: ['Software', 'MobileApps'],
				title: event.target.title.value.trim(),
				availability: event.target.availability.value.trim(),
				link: event.target.link.value.trim(),
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
					FlowRouter.go('/planning/resources/view/all/all/' + resourceId +'/app');
				}
			});

			return false;
		}
	});
});

Template.resourcesNewApp.helpers({
	
});

Template.resourcesNewApp.events({
	'submit .js-form-resources-app-new'(event) {
		event.preventDefault();
	},

	'click .js-cancel'(event) {
		event.preventDefault();
		
		Session.setPersistent('selectedFramePosition', 2);
		Session.setPersistent('selectedFrameClass', 'frame-position-two');
		FlowRouter.go('/planning/resources/view/' + Session.get('selectedResourceType') +'/'+ Session.get('selectedResourceAvailability') +'/'+ Session.get('selectedResourceId') +'/'+ Session.get('selectedResourceCurrentTypeId'));
	},
});