import {Questions} from '../questions.js';

Meteor.publish('allQuestions', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Questions.find({groupId: groupId}, {sort: {order: 1, question: 1}, fields: {order: 1, question: 1, type: 1, active: 1}});
});

Meteor.publish('question', function(questionId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Questions.find({groupId: groupId, _id: questionId}, {fields: {order: 1, question: 1, type: 1, options: 1, active: 1}});
});