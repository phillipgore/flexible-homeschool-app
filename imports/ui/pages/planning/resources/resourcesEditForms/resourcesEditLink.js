import {Template} from 'meteor/templating';
import { Resources } from '../../../../../api/resources/resources.js';
import './resourcesEditLink.html';

Template.resourcesEditLink.onCreated( function() {
	// Subscriptions
	this.subscribe('resource', FlowRouter.getParam('id'));
});

Template.resourcesEditLink.onRendered( function() {
	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		label: 'Edit Link Resource',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');

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
			const resourceProperties = {
				type: 'link',
				searchIndex: [],
				title: event.target.title.value.trim(),
				link: event.target.link.value.trim(),
				description: event.target.description.value.trim(),
			};

			Meteor.call('updateResource', FlowRouter.getParam('id'), resourceProperties, function(error) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: error.reason,
					});
				} else {
					FlowRouter.go('/planning/resources/view/' + FlowRouter.getParam('id'));
				}
			});

			return false;
		}
	});
});

Template.resourcesEditLink.helpers({
	resource: function() {
		return Resources.findOne();
	},
});

Template.resourcesEditLink.events({
	'submit .js-form-resources-link-edit'(event) {
		event.preventDefault();
	},
});