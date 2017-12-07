import {Template} from 'meteor/templating';
import './resourcesFormLink.html';

Template.resourcesFormLink.onRendered( function() {
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
			const resourceProperties = {
				type: 'link',
				searchIndex: [],
				title: event.target.title.value.trim(),
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

Template.resourcesFormLink.events({
	'submit .js-form-resources-link-new'(event) {
		event.preventDefault();
	},
});