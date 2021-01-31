import {Answers} from '../answers.js';

Meteor.publish('allAnswers', function(questionId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Answers.find({groupId: groupId});
});