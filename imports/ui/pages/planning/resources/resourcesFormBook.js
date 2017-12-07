import {Template} from 'meteor/templating';
import './resourcesFormBook.html';

Template.resourcesFormBook.onRendered( function() {
// Form Validation and Submission
	$('.js-form-resources-book-new').validate({
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
				type: 'book',
				searchIndex: ['Books', 'KindleStore'],
				title: event.target.title.value.trim(),
				author: event.target.author.value.trim(),
				availability: event.target.availability.value.trim(),
				link: event.target.link.value.trim(),
				publisher: event.target.publisher.value.trim(),
				publicationDate: event.target.publicationDate.value.trim(),
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

Template.resourcesNew.events({
	'submit .js-form-resources-book-new'(event) {
		event.preventDefault();
	},
});