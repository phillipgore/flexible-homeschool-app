import {Template} from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Questions } from '../../../../api/questions/questions.js';

import './officeQuestionsEdit.html';


Template.officeQuestionsEdit.onCreated( function() {
	this.question = Meteor.subscribe('question', FlowRouter.getParam('selectedQuestionId'));
});

Template.officeQuestionsEdit.onRendered( function() {
	let template = Template.instance();

	$('.js-form-questions-update').validate({
		rules: {
			question: { required: true },
		},
		messages: {
			question: { required: "Required." },
		},		

		submitHandler() {
			$('.js-saving').show();
			$('.js-submit').prop('disabled', true);

			const questionProperties = {
				_id: FlowRouter.getParam('selectedQuestionId'),
				question: template.find("[name='question']").value.trim(),
				type: template.find("[name='type']").value.trim(),
				active: template.find("[name='active']").value.trim() === 'true',
			}

			if (questionProperties.type === 'radioWithTextarea' || questionProperties.type === 'selectWithTextarea') {
				questionProperties.textareaLabel = template.find("[name='textareaLabel']").value.trim()
			}
			
			Meteor.call('updateQuestion', questionProperties, function(error, result) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'icn-danger',
						message: error.reason,
					});
				} else {
					FlowRouter.go('/office/questions/form/edit/1/' + FlowRouter.getParam('selectedQuestionId'));
				}
			});

			$('.js-saving').hide();
			$('.js-submit').prop('disabled', false);

			return false;

		}
	})
});
	
Template.officeQuestionsEdit.helpers({
	subscriptionReady: function() {
		if (Template.instance().question.ready()) {
			let showFollowUp = (question) => {
				if (question.type === 'radioWithTextarea' || question.type === 'selectWithTextarea') return true;
				return false;
			}

			let question = Questions.findOne({_id: FlowRouter.getParam('selectedQuestionId')});
			Session.set('showFollowUp', showFollowUp(question))
			return true;
		}
		return false;
	},

	types: [
		{label: 'Radio Button', value: 'radio'},
		{label: 'Checkbox', value: 'select'},
		{label: 'Textbox', value: 'textarea'},
		{label: 'Radio Button With Follow Up', value: 'radioWithTextarea'},
		{label: 'Checkbox With Follow Up', value: 'selectWithTextarea'},
	],

	question: function() {
		return Questions.findOne({_id: FlowRouter.getParam('selectedQuestionId')});
	},

	showFollowUp: function() {
		return Session.get('showFollowUp');
	},

	isSelected: function(type, value) {
		if (type === value) return 'selected';
		return null;
	},

	isChecked: function(value) {
		if (value) return 'checked';
		return null;
	},
});

Template.officeQuestionsEdit.events({
	'change .js-type'(event) {
		if (event.currentTarget.value === 'radioWithTextarea' || event.currentTarget.value === 'selectWithTextarea') {
			Session.set('showFollowUp', true)
		} else {
			Session.set('showFollowUp', false)
		}
	},

	'change .js-checkbox'(event) {
	    if ($(event.currentTarget).val() === 'true') {
	    	$(event.currentTarget).val('false');
	    } else {
	    	$(event.currentTarget).val('true');
	    }
	},

	'submit .js-form-questions-update'(event, template) {
		event.preventDefault();
	},
});