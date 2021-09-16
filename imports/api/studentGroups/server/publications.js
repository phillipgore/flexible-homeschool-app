import {StudentGroups} from '../studentGroups.js';

Meteor.publish('allStudentGroups', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return StudentGroups.find({groupId: groupId}, {sort: {name: 1}, fields: {name: 1, studentIds: 1}});
});

Meteor.publish('studentGroup', function(studentGroupId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return StudentGroups.find({groupId: groupId, _id: studentGroupId}, {fields: {name: 1, studentIds: 1}});
});

Meteor.publish('aStudentsGroups', function(studentId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return StudentGroups.find({groupId: groupId, studentIds: studentId}, {fields: {name: 1, studentIds: 1}});
});