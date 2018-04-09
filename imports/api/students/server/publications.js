import {Students} from '../students.js';

Meteor.publish('basicStudents', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Students.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, firstName: 1}, fields: {birthday: 1, lastName: 1, firstName: 1}});
});

Meteor.publish('allStudents', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Students.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, firstName: 1}});
});

Meteor.publish('student', function(studentId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Students.find({groupId: groupId, deletedOn: { $exists: false }, _id: studentId});
});