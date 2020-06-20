import {Template} from 'meteor/templating';
import { Groups } from '../../../../api/groups/groups.js';
import { Questions } from '../../../../api/questions/questions.js';

import './billingPause.html';
import moment from 'moment';

Template.billingPause.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		this.questionData = Meteor.subscribe('allActiveQuestions');
	});

	Session.set('formError', false)
});

Template.billingPause.onRendered( function() {
	Session.set({
		toolbarType: 'billing',
		labelThree: 'Pause Account',
		activeNav: 'settingsList',
	});
});

Template.billingPause.helpers({
	questions: function() {
		return Questions.find({}, {sort: {order: 1, question: 1}});
	},

	questionType: function(questionType, type) {
		if (questionType === type) {return true}
		return false;
	},
});

Template.billingPause.events({
	'click .js-radio, click .js-checkbox'(event) {
		$(event.currentTarget).find('.question-error').text('');
		Session.set('formError', false)
	},

	'click .js-pause-account'(event) {
		event.preventDefault();
		$('.list-item-loading').show();

		let answerProperties = [];

		$('.js-form-pause-new').find('.js-radio, .js-checkbox').each(function() {
			let optionIds = []
			$(this).find("[name='" +this.id+ "']:checked").each(function() {
				optionIds.push(this.value)
			});

			answerProperties.push({
				type: 'select',
				questionId: this.id,
				optionIds: optionIds
			})
		});

		$('.js-textarea').each(function() {
			if (this.value) {
				answerProperties.push({
					type: 'text',
					questionId: this.id,
					textAnswer: this.value
				})
			}
		});

		answerProperties.forEach(answer => {
			if (answer.type === 'select' && !answer.optionIds.length) {
				$('.' + answer.questionId + '-errors').text('Please make a selection.');
				$('.list-item-loading').hide();
				Session.set('formError', true)
			}
		});

		if (!$(event.currentTarget).is(':disabled') && !Session.get('formError')) {
			$(event.currentTarget).prop('disabled', true);

			let groupId = $('.js-pause-account').attr('id');

			Meteor.call('pauseSubscription', answerProperties, function(error, result) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'icn-danger',
						message: error.reason,
					});
					$(event.currentTarget).prop('disabled', false);
					$('.list-item-loading').hide();
				} else {
					$(event.currentTarget).prop('disabled', false);
					$('.list-item-loading').hide();
					FlowRouter.go('/settings/billing/invoices/3')
					let subscriptionPausedOn = moment(Groups.findOne({}).subscriptionPausedOn).format('MMMM D, YYYY');
					Alerts.insert({
						colorClass: 'bg-info',
						iconClass: 'icn-info',
						message: `Your account is paused. You are no longer being billed. You will have access to your data until ${subscriptionPausedOn}. You may unpause your account at any time.`,
					});
				}
			})
		}
	},
});