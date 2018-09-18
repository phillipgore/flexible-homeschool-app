import {Template} from 'meteor/templating';

import autosize from 'autosize';
import './resourcesNewApp.html';

Template.resourcesNewApp.onCreated( function() {
	Session.set('selectedResourceNewType', FlowRouter.getParam('selectedResourceNewType'));
	Session.set('selectedResourceType', 'all');
	Session.set('selectedResourceAvailability', 'all');
	Session.set('selectedResourceId', Session.get('initialIds').resourceAllAll);
	Session.set('selectedResourceCurrentType', Session.get('initialIds').resourceCurrentType);
});

Template.resourcesNewApp.onRendered( function() {
	let template = Template.instance();
	
	Session.set({
		toolbarType: 'new',
		labelThree: 'New App Resource',
		
		
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
			$('.js-saving').show();
			$('.js-submit').prop('disabled', true);

			const resourceProperties = {
				type: 'app',
				searchIndex: ['Software', 'MobileApps'],
				title: template.find("[name='title']").value.trim(),
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
					FlowRouter.go('/planning/resources/view/3/all/all/' + resourceId +'/app');
				}
			});

			return false;
		}
	});
});

Template.resourcesNewApp.helpers({
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

Template.resourcesNewApp.events({
	'submit .js-form-resources-app-new'(event) {
		event.preventDefault();
	},
});