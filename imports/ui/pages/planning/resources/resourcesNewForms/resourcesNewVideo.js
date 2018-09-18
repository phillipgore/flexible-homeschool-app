import {Template} from 'meteor/templating';

import autosize from 'autosize';
import './resourcesNewVideo.html';

Template.resourcesNewVideo.onCreated( function() {
	Session.set('selectedResourceNewType', FlowRouter.getParam('selectedResourceNewType'));
	Session.set('selectedResourceType', 'all');
	Session.set('selectedResourceAvailability', 'all');
	Session.set('selectedResourceId', Session.get('initialIds').resourceAllAll);
	Session.set('selectedResourceCurrentType', Session.get('initialIds').resourceCurrentType);
});

Template.resourcesNewVideo.onRendered( function() {
	let template = Template.instance();

	Session.set('selectedResourceNewType', FlowRouter.getParam('selectedResourceNewType'));
	
	Session.set({
		toolbarType: 'new',
		labelThree: 'New Video Resource',
		
		
		activeNav: 'planningList',
	});

	// Textarea Autoresize
	autosize($('#description'));

	// Form Validation and Submission
	$('.js-form-resources-video-new').validate({
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
				type: 'video',
				searchIndex: ['Movies', 'UnboxVideo'],
				title: template.find("[name='title']").value.trim(),
				directorFirstName: template.find("[name='directorFirstName']").value.trim(),
				directorLastName: template.find("[name='directorLastName']").value.trim(),
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
					FlowRouter.go('/planning/resources/view/3/all/all/' + resourceId +'/video');
				}
			});

			return false;
		}
	});
});

Template.resourcesNewVideo.helpers({
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

Template.resourcesNewVideo.events({
	'submit .js-form-resources-video-new'(event) {
		event.preventDefault();
	},
});