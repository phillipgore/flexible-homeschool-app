import {Subjects} from '../subjects.js';

Meteor.publish('allSubjects', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Subjects.find({groupId: groupId}, {sort: {order: 1}});
});

Meteor.publish('subject', function(subjectId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Subjects.find({groupId: groupId, _id: subjectId});
});