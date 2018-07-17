import {Template} from 'meteor/templating';
import { Resources } from '../../../../../api/resources/resources.js';

import autosize from 'autosize';
import './resourcesEditLink.html';

Template.resourcesEditLink.onCreated( function() {
	this.subscribe('resource', FlowRouter.getParam('selectedResourceId'));
});

Template.resourcesEditLink.onRendered( function() {
	let template = Template.instance();
	
	// Toolbar Settings
	Session.set({
		toolbarType: 'edit',
		labelThree: 'Edit Link Resource',
		
		
		activeNav: 'planningList',
	});

	// Textarea Autoresize
	autosize($('#description'));

	// Form Validation and Submission
	$('.js-form-resources-link-edit').validate({
		rules: {
			title: { required: true },
			link: { url: true },
		},
		messages: {
			title: { required: "Required." },
			link: { url: "Please enter a valid url. ex: http://www.amazon.com" },
		},		

		submitHandler() {
			$('.js-updating').show();
			$('.js-submit').prop('disabled', true);

			const resourceProperties = {
				type: 'link',
				searchIndex: [],
				title: template.find("[name='title']").value.trim(),
				link: template.find("[name='link']").value.trim(),
				description: template.find("[name='description']").value.trim(),
				availability: 'own',
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
					FlowRouter.go('/planning/resources/view/3/' + FlowRouter.getParam('selectedResourceType') +'/'+ FlowRouter.getParam('selectedResourceAvailability') +'/'+ FlowRouter.getParam('selectedResourceId') +'/'+ FlowRouter.getParam('selectedResourceCurrentTypeId'));
				}
			});

			return false;
		}
	});
});

Template.resourcesEditLink.helpers({
	resource: function() {
		return Resources.findOne({_id: FlowRouter.getParam('selectedResourceId')});
	},

	cancelPath: function() {
		return '/planning/resources/view/3/' + FlowRouter.getParam('selectedResourceType') +'/'+ FlowRouter.getParam('selectedResourceAvailability') +'/'+ FlowRouter.getParam('selectedResourceId') +'/'+ FlowRouter.getParam('selectedResourceCurrentTypeId');
	},
});

Template.resourcesEditLink.events({
	'submit .js-form-resources-link-edit'(event) {
		event.preventDefault();
	},
});