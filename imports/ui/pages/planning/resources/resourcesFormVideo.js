import {Template} from 'meteor/templating';
import './resourcesFormVideo.html';

Template.resourcesFormVideo.onRendered( function() {
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
			const resourceProperties = {
				type: 'video',
				searchIndex: ['Movies', 'UnboxVideo'],
				title: event.target.title.value.trim(),
				director: event.target.director.value.trim(),
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

Template.resourcesFormVideo.events({
	'submit .js-form-resources-video-new'(event) {
		event.preventDefault();
	},
});