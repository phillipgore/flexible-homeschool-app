import {Template} from 'meteor/templating';
import { Questions } from '../../../../api/questions/questions.js';

import './officeQuestionsList.html';
import Sortable from 'sortablejs';

Template.officeQuestionsList.onCreated( function() {
	// Subscriptions
	this.questionData = Meteor.subscribe('allQuestions');
});

Template.officeQuestionsList.onRendered( function() {
	Session.set({
		labelOne: "Questions"
	});
});

Template.officeQuestionsList.helpers({
	questions: function() {
		return Questions.find({}, {sort: {order: 1, question: 1}});
	},
});





Template.officeQuestionsListComp.onCreated( function() {
	// Subscriptions
	this.questionData = Meteor.subscribe('allQuestions');
});

Template.officeQuestionsListComp.onRendered( function() {
	var el = document.getElementById('js-question-sortable');
	var sortable = Sortable.create(el, {
		animation: 150,
		ghostClass: "sortable-ghost",  // Class name for the drop placeholder
		chosenClass: "sortable-chosen",  // Class name for the chosen item
		dragClass: "sortable-drag",  // Class name for the dragging item
		onUpdate: function (event) {
			let batchQuestionProperties = []
			document.querySelectorAll('.js-question').forEach((question, index) => {
				batchQuestionProperties.push({_id: question.id, order: index + 1})
			});
			Meteor.call('batchUpdateQuestions', batchQuestionProperties, function(error) {
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
});

Template.officeQuestionsListComp.helpers({
	questions: function() {
		return Questions.find({}, {sort: {order: 1, question: 1}});
	},

	selectedQuestionId: function() {
		return FlowRouter.getParam('selectedQuestionId');
	},

	selectedQuestionType: function() {
		return FlowRouter.getParam('selectedQuestionType');
	},

	activeRoute: function(currentRoute, route) {
		if (currentRoute === route) {
			return true;
		}
		return false;
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedQuestionId') === id) {
			return true;
		}
		return false;
	},

	getIcon: function(value, type) {
		if (value === type) return true;
		return false;
	},
});

Template.officeQuestionsListComp.events({
	
});