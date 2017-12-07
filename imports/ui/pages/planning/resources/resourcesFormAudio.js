import {Template} from 'meteor/templating';
import './resourcesFormAudio.html';

Template.resourcesFormAudio.onRendered( function() {
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
			const resourceProperties = {
				type: 'audio',
				searchIndex: ['Music', 'MP3Downloads'],
				title: event.target.title.value.trim(),
				artist: event.target.artist.value.trim(),
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

Template.resourcesFormAudio.events({
	'submit .js-form-resources-audio-new'(event) {
		event.preventDefault();
	},
});