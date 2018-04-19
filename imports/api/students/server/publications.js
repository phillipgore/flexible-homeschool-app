import {Students} from '../students.js';
import {studentStatusAndUrlIds} from '../../../modules/server/functions';

Meteor.publish('allStudents', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Students.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, fields: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}});
});

Meteor.publish('allStudentStats', function(schoolYearId, termId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	let subHandle = Students
		.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, fields: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}})
		.observeChanges({
			added: (id, student) => {
				fields = studentStatusAndUrlIds(student, schoolYearId, termId);
				this.added('students', id, student);
			},
			changed: (id, student) => {
				fields = studentStatusAndUrlIds(student, schoolYearId, termId);
				this.changed('students', id, student);
			},
			removed: (id) => {
				this.removed('students', id);
			}
		});
	this.ready();
	this.onStop(() => {
		subHandle.stop();
	});
});

Meteor.publish('student', function(studentId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Students.find({groupId: groupId, deletedOn: { $exists: false }, _id: studentId});
});