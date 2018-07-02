import {Students} from '../students.js';
import {Terms} from '../../terms/terms.js';
import {studentStatusAndPaths} from '../../../modules/server/functions';

Meteor.publish('allStudents', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Students.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, fields: {birthday: 1, firstName: 1, middleName: 1, lastName: 1, 'preferredFirstName.type': 1, 'preferredFirstName.name': 1}});
});

Meteor.publish('studentStats', function(schoolYearId, termId, weekId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let students = Students.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, fields: {id: 1}});

		students.map((student) => {
			student.studentId = student._id;
			term = studentStatusAndPaths(student, student._id, schoolYearId, termId, weekId);
			self.added('studentStats', Random.id(), student);
		});

		self.ready();
	});
});

Meteor.publish('student', function(studentId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Students.find({groupId: groupId, deletedOn: { $exists: false }, _id: studentId});
});