import {Subjects} from '../subjects.js';

Meteor.publish('schooYearStudentSubject', function(schoolYearId, studentIdtype, selectedId) {
	if (!this.userId) {
		return this.ready();
	}
	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;	
	if (studentIdtype === 'students') {
		return Subjects.find({groupId: groupId, schoolYearId: schoolYearId, studentId: selectedId}, {sort: {name: 1}, fields: {name: 1, studentId: 1, schoolYearId: 1}});
	}
	return Subjects.find({groupId: groupId, schoolYearId: schoolYearId, studentGroupId: selectedId}, {sort: {name: 1}, fields: {name: 1, studentGroupId: 1, schoolYearId: 1}});
});

Meteor.publish('subject', function(subjectId) {
	if (!this.userId || subjectId === 'empty') {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Subjects.find({_id: subjectId, groupId: groupId}, {fields: {name: 1, studentId: 1, schoolYearId: 1}});
});

Meteor.publish('subjectsView', function(subjectId) {
	if (!this.userId || subjectId === 'empty') {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Subjects.find({_id: subjectId, groupId: groupId}, {fields: {name: 1, studentId: 1, schoolYearId: 1}});
});