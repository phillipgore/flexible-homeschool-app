import {Answers} from '../answers.js';
import {Counts} from 'meteor/tmeasday:publish-counts';

Meteor.publish('answerCount', function(questionId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	Counts.publish(this, 'answerCount', Answers.find({questionId: questionId, groupId: groupId}));
});