import {Template} from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Questions } from '../../../../api/questions/questions.js';

import './officeQuestionsForm.html';

LocalRadios = new Mongo.Collection(null);
LocalCheckboxes = new Mongo.Collection(null);


Template.officeQuestionsForm.onCreated( function() {

});

Template.officeQuestionsForm.onRendered( function() {
	let template = Template.instance();

	LocalRadios.remove({});
	LocalRadios.insert({_id: Random.id(), defaultValue: true});

	LocalCheckboxes.remove({});
	LocalCheckboxes.insert({_id: Random.id()});

	$('.js-form-questions-new').validate({
		rules: {
			question: { required: true },
		},
		messages: {
			question: { required: "Required." },
		},		

		submitHandler() {
			const questionProperties = {
				order: Questions.find().count() + 1,
				question: template.find("[name='question']").value.trim(),
				type: FlowRouter.getParam('selectedQuestionType'),
				active: template.find("[name='active']").value.trim() === 'true',
			}

			if (questionProperties.type === 'radio') {
				let radioOptions = [];
				LocalRadios.find({label: {$exists: true}}).forEach(localRadio => {
					if (localRadio.label != '' && localRadio.label != undefined) {
						radioOptions.push({
							_id: localRadio._id, 
							label: localRadio.label, 
							defaultValue: localRadio.defaultValue ? localRadio.defaultValue : false,
						});
					}
				});

				questionProperties.options = radioOptions;
			}

			if (questionProperties.type === 'checkbox') {
				let checkboxOptions = [];
				LocalCheckboxes.find({label: {$exists: true}}).forEach(localCheckbox => {
					if (localCheckbox.label != '' && localCheckbox.label != undefined) {
						checkboxOptions.push({
							_id: localCheckbox._id, 
							label: localCheckbox.label, 
							defaultValue: localCheckbox.defaultValue ? localCheckbox.defaultValue : false,
						});
					}
				});

				questionProperties.options = checkboxOptions;
			}

			if (questionProperties.type != 'textarea' && questionProperties.options.length < 2) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: 'You must have at least two Possible Answers.',
				});
			} else {
				$('.js-saving').show();
				$('.js-submit').prop('disabled', true);
				
				Meteor.call('insertQuestion', questionProperties, function(error, questionId) {
					if (error) {
						Alerts.insert({
							colorClass: 'bg-danger',
							iconClass: 'icn-danger',
							message: error.reason,
						});
						
						$('.js-saving').hide();
						$('.js-submit').prop('disabled', false);
					} else {
						Session.set('selectedQuestionId', questionId);
						FlowRouter.go('/office/questions/view/2/' + Session.get('selectedQuestionId'));
					}
				});
			}

			return false;

		}
	})
});
	
Template.officeQuestionsForm.helpers({
	LocalRadios: function() {
		return LocalRadios.find();
	},

	LocalCheckboxes: function() {
		return LocalCheckboxes.find();
	},

	indexIncrement: function(index) {
		return index + 1;
	},

	isType: function(type) {
		return (FlowRouter.getParam('selectedQuestionType') === type);
	},

	selectedQuestionId: function() {
		return Session.get('selectedQuestionId')
	}
});

Template.officeQuestionsForm.events({
	'keyup .js-radio-label'(event) {
		let radioId = $(event.currentTarget).parentsUntil('.js-radio-input').parent().attr('id');
		LocalRadios.update({_id: radioId}, {$set: {label: event.currentTarget.value.trim()}});

		let valueCount = [];
		$('.js-radio-input').find('.js-radio-label').each(function() {
			if ($(this).val()) {
				valueCount.push($(this).val());
			}
		});

		let localRadiosCount = LocalRadios.find().count()
		if (valueCount.length === localRadiosCount) {
			LocalRadios.insert({_id: Random.id()});
		}
	},

	'click .js-radio-delete'(event) {
		event.preventDefault();

		let radioId = $(event.currentTarget).parentsUntil('.js-radio-input').parent().attr('id');		
		if (radioId === $('.js-radio-input:last').attr('id')) {
			$('.js-radio-input:last .js-radio-label').val('');
		} else {
			LocalRadios.remove({_id: radioId});
		}

		if (!LocalRadios.findOne({defaultValue: true})) {
			let newDefaultId = LocalRadios.findOne()._id
			LocalRadios.update({_id: newDefaultId}, {$set: {defaultValue: true}});
		}
	},

	'click .js-radio-make-default'(event) {
		event.preventDefault();

		let radioId = $(event.currentTarget).parentsUntil('.js-radio-input').parent().attr('id');
		if (radioId != $('.js-radio-input:last').attr('id')) {
			LocalRadios.update({}, {$set: {defaultValue: false}});
			LocalRadios.update({_id: radioId}, {$set: {defaultValue: true}});
		}
	},

	'keyup .js-checkbox-label'(event) {
		let checkboxId = $(event.currentTarget).parentsUntil('.js-checkbox-input').parent().attr('id');
		LocalCheckboxes.update({_id: checkboxId}, {$set: {label: event.currentTarget.value.trim()}});

		let valueCount = [];
		$('.js-checkbox-input').find('.js-checkbox-label').each(function() {
			if ($(this).val()) {
				valueCount.push($(this).val());
			}
		});

		let localCheckboxCount = LocalCheckboxes.find().count()
		if (valueCount.length === localCheckboxCount) {
			LocalCheckboxes.insert({_id: Random.id()});
		}
	},

	'click .js-checkbox-delete'(event) {
		event.preventDefault();

		let checkboxId = $(event.currentTarget).parentsUntil('.js-checkbox-input').parent().attr('id')		
		if (checkboxId === $('.js-checkbox-input:last').attr('id')) {
			$('.js-checkbox-input:last .js-checkbox-label').val('');
		} else {
			LocalCheckboxes.remove({_id: checkboxId});
		}
	},

	'change .js-checkbox-make-default'(event) {
		event.preventDefault();

		let checkboxId = $(event.currentTarget).parentsUntil('.js-checkbox-input').parent().attr('id');
		if (checkboxId != $('.js-checkbox-input:last').attr('id')) {
			if (LocalCheckboxes.findOne({_id: checkboxId}).defaultValue) {
		    	LocalCheckboxes.update({_id: checkboxId}, {$set: {defaultValue: false}});
		    } else {
		    	LocalCheckboxes.update({_id: checkboxId}, {$set: {defaultValue: true}});
		    }
		}
	},

	'change .js-checkbox'(event) {
	    if ($(event.currentTarget).val() === 'true') {
	    	$(event.currentTarget).val('false');
	    } else {
	    	$(event.currentTarget).val('true');
	    }
	},

	'submit .js-form-questions-new'(event, template) {
		event.preventDefault();
	},
});