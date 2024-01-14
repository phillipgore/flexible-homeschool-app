import {Template} from 'meteor/templating';
import { Questions } from '../../../../api/questions/questions.js';

import './officeQuestionsView.html';

Template.officeQuestionsView.onCreated( function() {	
	let template = Template.instance();
	
	template.autorun(() => {
		this.questionData = Meteor.subscribe('question', FlowRouter.getParam('selectedQuestionId'));
		this.answerCount = Meteor.subscribe('answerCount', FlowRouter.getParam('selectedQuestionId'));
	});
});

Template.officeQuestionsView.onRendered( function() {
	// Toolbar Settings
	Session.set({
		labelThree: 'Question',
	});
});

Template.officeQuestionsView.helpers({
	subscriptionReady: function() {
		if (Template.instance().questionData.ready() && Template.instance().answerCount.ready()) {
			return true;
		}
	},
	
	question: function() {
		return Questions.findOne({_id: FlowRouter.getParam('selectedQuestionId')});
	},

	selectedQuestionId: function() {
		return FlowRouter.getParam('selectedQuestionId');
	},

	getType: function(type) {
		if (type === 'radio') {
			return 'Radio Question';
		}
		if (type === 'checkbox') {
			return 'Checkbox Question';
		}
		return 'Textarea Question';
	},
});

Template.officeQuestionsView.events({
	'click .js-delete'(event) {
	    event.preventDefault();

	    function nextPath(selectedQuestionId) {
			let questionIds = Questions.find({}, {sort: {order: 1}}).map(question => (question._id));
			let selectedIndex = questionIds.indexOf(selectedQuestionId);
			let newIds = {};

			if (selectedIndex) {
				let firstQuestionId = questionIds[selectedIndex - 1];
				newIds.firstQuestionId = firstQuestionId;
			} else {
				let firstQuestionId = questionIds[selectedIndex + 1];
				newIds.firstQuestionId = firstQuestionId;
			}
				
			if (newIds.firstQuestionId) {
				newIds.firstQuestionId = newIds.firstQuestionId;
			} else {
				newIds.firstQuestionId = 'empty';
			}

			return newIds;
		};

		if (!Counts.get('answerCountPerQuestion')) {
			let newPath = nextPath(FlowRouter.getParam('selectedQuestionId'));

		    Meteor.call('deleteQuestion', FlowRouter.getParam('selectedQuestionId'), function(error, result) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'icn-danger',
						message: error.reason,
					});
				} else {
					FlowRouter.go('/office/questions/view/2/' + newPath.firstQuestionId);
				}
			});
		}
	},

	'click .js-make-inactive'(event) {
	    event.preventDefault();

	    let = questionProperties = {_id: FlowRouter.getParam('selectedQuestionId'), active: false};
	    Meteor.call('updateQuestion', questionProperties, function(error, result) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: error.reason,
				});
			}
		});
	},

	'click .js-make-active'(event) {
	    event.preventDefault();

	    let questionProperties = {_id: FlowRouter.getParam('selectedQuestionId'), active: true};
	    Meteor.call('updateQuestion', questionProperties, function(error, result) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: error.reason,
				});
			}
		});
	},
});





