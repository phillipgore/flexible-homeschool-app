import {Template} from 'meteor/templating';
import { Resources } from '../../../../../api/resources/resources.js';

import autosize from 'autosize';
import './resourcesEditVideo.html';

Template.resourcesEditVideo.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		this.subscribe('resource', FlowRouter.getParam('selectedResourceId'));
	});
});

Template.resourcesEditVideo.onRendered( function() {
	let template = Template.instance();
	
	Session.set({
		toolbarType: 'edit',
		labelThree: 'Edit Video Resource',
		
		
		activeNav: 'planningList',
	});

	// Textarea Autoresize
	autosize($('#description'));

	// Form Validation and Submission
	$('.js-form-resources-video-edit').validate({
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
				type: 'video',
				searchIndex: ['Movies', 'UnboxVideo'],
				title: template.find("[name='title']").value.trim(),
				directorFirstName: template.find("[name='directorFirstName']").value.trim(),
				directorLastName: template.find("[name='directorLastName']").value.trim(),
				availability: template.find("[name='availability']:checked").value.trim(),
				link: template.find("[name='link']").value.trim(),
				description: template.find("[name='description']").value.trim(),
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

Template.resourcesEditVideo.helpers({
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
		return '/planning/resources/view/2/' + FlowRouter.getParam('selectedResourceType') +'/'+ FlowRouter.getParam('selectedResourceAvailability') +'/'+ FlowRouter.getParam('selectedResourceId') +'/'+ FlowRouter.getParam('selectedResourceCurrentTypeId');
	},
});

Template.resourcesEditVideo.events({
	'submit .js-form-resources-video-edit'(event) {
		event.preventDefault();
	},
});