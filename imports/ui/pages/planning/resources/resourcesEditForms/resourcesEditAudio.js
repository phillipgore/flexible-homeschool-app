import {Template} from 'meteor/templating';
import { Resources } from '../../../../../api/resources/resources.js';

import autosize from 'autosize';
import './resourcesEditAudio.html';

Template.resourcesEditAudio.onCreated( function() {
	this.subscribe('resource', FlowRouter.getParam('selectedResourceId'));
});

Template.resourcesEditAudio.onRendered( function() {
	// Toolbar Settings
	Session.set({
		toolbarType: 'edit',
		labelThree: 'Edit Audio Resource',
		selectedFramePosition: 3,
		selectedFrameClass: 'frame-position-three',
		activeNav: 'planningList',
	});

	// Textarea Autoresize
	autosize($('#description'));

	// Form Validation and Submission
	$('.js-form-resources-audio-edit').validate({
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
			$('.js-updating').show();
			$('.js-submit').prop('disabled', true);

			const resourceProperties = {
				type: 'audio',
				searchIndex: ['Music', 'MP3Downloads'],
				title: event.target.title.value.trim(),
				artistFirstName: event.target.artistFirstName.value.trim(),
				artistLastName: event.target.artistLastName.value.trim(),
				availability: event.target.availability.value.trim(),
				link: event.target.link.value.trim(),
				description: event.target.description.value.trim(),
			};

			Meteor.call('updateResource', FlowRouter.getParam('selectedResourceId'), resourceProperties, function(error) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: error.reason,
					});
					
					$('.js-updating').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					FlowRouter.go('/planning/resources/view/' + FlowRouter.getParam('selectedResourceType') +'/'+ FlowRouter.getParam('selectedResourceAvailability') +'/'+ FlowRouter.getParam('selectedResourceId') +'/'+ FlowRouter.getParam('selectedResourceCurrentTypeId'));
				}
			});

			return false;
		}
	});
});

Template.resourcesEditAudio.helpers({
	resource: function() {
		return Resources.findOne({_id: FlowRouter.getParam('selectedResourceId')});
	},

	availability: function(currentAvailability, availability) {
		if (currentAvailability === availability) {
			return true;
		}
		return false;
	},

	cancelPath: function() {
		return '/planning/resources/view/' + FlowRouter.getParam('selectedResourceType') +'/'+ FlowRouter.getParam('selectedResourceAvailability') +'/'+ FlowRouter.getParam('selectedResourceId') +'/'+ FlowRouter.getParam('selectedResourceCurrentTypeId');
	},
});

Template.resourcesEditAudio.events({
	'submit .js-form-resources-audio-edit'(event) {
		event.preventDefault();
	},
});