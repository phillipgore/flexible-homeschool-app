import {Template} from 'meteor/templating';
import './resourcesFormApp.html';

Template.resourcesFormApp.onRendered( function() {
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
						iconClass: 'fss-icn-danger',
						message: error.reason,
					});
				} else {
					FlowRouter.go('/planning/resources/list');
				}
			});

			return false;
		}
	});
});

Template.resourcesFormApp.events({
	'submit .js-form-resources-app-new'(event) {
		event.preventDefault();
	},
});