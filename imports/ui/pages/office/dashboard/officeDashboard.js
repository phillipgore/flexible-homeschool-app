import { Template } from "meteor/templating";
import { Questions } from '../../../../api/questions/questions.js';
import { Answers } from '../../../../api/answers/answers.js';

import "./officeDashboard.html";

Template.officeDashboard.onCreated(function()  {
	const template = Template.instance();

	template.autorun(() => {
		Meteor.call('getInitialGroupIds', function(error, result) {
			Session.set('initialGroupIds', result)
		});
		this.accountData = Meteor.subscribe('allAccountTotals');
		this.questionData = Meteor.subscribe('allQuestions');
		this.answerData = Meteor.subscribe('allAnswers');
	});
});

Template.officeDashboard.onRendered(() => {
	Session.set({
		labelOne: "Dashboard"
	});
});

Template.officeDashboard.helpers({
	getInitialGroupId: function(status) {
		if (Session.get('initialGroupIds')) {
			return Session.get('initialGroupIds')[status] && Session.get('initialGroupIds')[status];
		}
	},
	
	subscriptionReady() {
		return Template.instance().accountData.ready();
	},

	questions: function(type) {
		return Questions.find({type: type});
	},

	anwserCount: function(questionId, optionId) {
		return Answers.find({questionId: questionId, optionIds: optionId}).count();
	}
});
