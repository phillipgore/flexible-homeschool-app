import {Template} from 'meteor/templating';

import autosize from 'autosize';
import './resourcesNewAudio.html';

Template.resourcesNewAudio.onCreated( function() {
	Session.set('selectedResourceNewType', FlowRouter.getParam('selectedResourceNewType'));
	Session.set('selectedResourceType', 'all');
	Session.set('selectedResourceAvailability', 'all');
	Session.set('selectedResourceId', Session.get('initialIds').resourceAllAll);
	Session.set('selectedResourceCurrentType', Session.get('initialIds').resourceCurrentType);
});

Template.resourcesNewAudio.onRendered( function() {
	let template = Template.instance();
	
	Session.set('selectedResourceNewType', FlowRouter.getParam('selectedResourceNewType'));
	
	Session.set({
		toolbarType: 'new',
		labelThree: 'New Audio Resource',
		
		
		activeNav: 'planningList',
	});

	// Textarea Autoresize
	autosize($('#description'));

	// Form Validation and Submission
	$('.js-form-resources-audio-new').validate({
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
				type: 'audio',
				searchIndex: ['Music', 'MP3Downloads'],
				title: template.find("[name='title']").value.trim(),
				artistFirstName: template.find("[name='artistFirstName']").value.trim(),
				artistLastName: template.find("[name='artistLastName']").value.trim(),
				availability: template.find("[name='availability']:checked").value.trim(),
				link: template.find("[name='link']").value.trim(),
				description: $('#' + $(event.currentTarget).find('.editor-content').attr('id')).html(),
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
					FlowRouter.go('/planning/resources/view/3/all/all/' + resourceId +'/audio');
				}
			});

			return false;
		}
	});
});

Template.resourcesNewAudio.helpers({
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

Template.resourcesNewAudio.events({
	'submit .js-form-resources-audio-new'(event) {
		event.preventDefault();
	},
});