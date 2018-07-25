import {Template} from 'meteor/templating';

import autosize from 'autosize';
import './resourcesNewBook.html';

Template.resourcesNewBook.onCreated( function() {
	Session.set('selectedResourceNewType', FlowRouter.getParam('selectedResourceNewType'));
	Session.set('selectedResourceType', 'all');
	Session.set('selectedResourceAvailability', 'all');
	Session.set('selectedResourceId', InitialIds.findOne().resourceAllAll);
	Session.set('selectedResourceCurrentType', InitialIds.findOne().resourceCurrentType);
});

Template.resourcesNewBook.onRendered( function() {
	let template = Template.instance();
	
	Session.set('selectedResourceNewType', FlowRouter.getParam('selectedResourceNewType'));
	
	Session.set({
		toolbarType: 'new',
		labelThree: 'New Book Resource',
		
		
		activeNav: 'planningList',
	});

	// Textarea Autoresize
	autosize($('#description'));
	
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
			$('.js-saving').show();
			$('.js-submit').prop('disabled', true);

			const resourceProperties = {
				type: 'book',
				searchIndex: ['Books', 'KindleStore'],
				title: template.find("[name='title']").value.trim(),
				authorFirstName: template.find("[name='authorFirstName']").value.trim(),
				authorLastName: template.find("[name='authorLastName']").value.trim(),
				availability: template.find("[name='availability']:checked").value.trim(),
				link: template.find("[name='link']").value.trim(),
				publisher: template.find("[name='publisher']").value.trim(),
				publicationDate: template.find("[name='publicationDate']").value.trim(),
				description: Session.get($(event.currentTarget).find('.editor-content').attr('id')),
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
					FlowRouter.go('/planning/resources/view/3/all/all/' + resourceId +'/book');
				}
			});

			return false;
		}
	});
});

Template.resourcesNewBook.helpers({
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

Template.resourcesNewBook.events({
	'submit .js-form-resources-book-new'(event) {
		event.preventDefault();
	},
});