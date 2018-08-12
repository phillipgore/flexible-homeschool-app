import {Students} from '../students.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Terms} from '../../terms/terms.js';
import {SchoolWork} from '../../schoolWork/schoolWork.js';
import {Lessons} from '../../lessons/lessons.js';
import {studentStatusAndPaths} from '../../../modules/server/functions';
import {studentSchoolYearsStatusAndPaths} from '../../../modules/server/functions';
import {studentTermStatusAndPaths} from '../../../modules/server/functions';
import {allSchoolYearsStatusAndPaths} from '../../../modules/server/functions';

import {studentPaths} from '../../../modules/server/functions';
import {studentStats} from '../../../modules/server/functions';

Meteor.publish('allStudents', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Students.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, fields: {birthday: 1, firstName: 1, middleName: 1, lastName: 1, 'preferredFirstName.name': 1}});
});

Meteor.publish('student', function(studentId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Students.find({groupId: groupId, deletedOn: { $exists: false }, _id: studentId});
});


Meteor.publish('trackinglistPub', function(studentId, schoolYearId, termId, weekId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let students = Students.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, fields: {birthday: 1, firstName: 1, middleName: 1, lastName: 1, 'preferredFirstName.name': 1}});
		let schoolYears = SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}, fields: {startYear: 1, endYear: 1}});
		let terms = Terms.find({schoolYearId: schoolYearId, groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, schoolYearId: 1}});

		students.map((student) => {
			self.added('students', student._id, student);
		});

		schoolYears.map((schoolYear) => {
			schoolYear = allSchoolYearsStatusAndPaths(schoolYear, schoolYear._id);
			self.added('schoolYears', schoolYear._id, schoolYear);
		});

		terms.map((term) => {
			term = studentTermStatusAndPaths(term, term._id, schoolYearId, studentId);
			self.added('terms', term._id, term);
		});

		self.ready();
	});
});


Meteor.publish('trackingStatsPub', function(studentId, schoolYearId, termId, weekId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let students = Students.find({groupId: groupId, deletedOn: { $exists: false }}, {fields: {_id: 1}});

		students.map((student) => {
			student.studentId = student._id;
			term = studentStats(student, student._id, schoolYearId, termId, weekId);
			self.added('studentStats', Random.id(), student);
		});

		self.ready();
	});
});

Meteor.publish('testStatsPub', function(studentId, schoolYearId, termId, weekId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let students = Students.find({groupId: groupId, deletedOn: { $exists: false }}, {fields: {_id: 1}});

		console.log('run')

		students.map((student) => {
			let schoolWorkIds = SchoolWork.find({studentId: student._id, schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(schoolWork => (schoolWork._id));

			let yearLessonsTotal = Lessons.aggregate(
				{$match: {groupId: groupId, schoolWorkId: {$in: schoolWorkIds}, deletedOn: { $exists: false }}},
				{$group: {_id: '$weekId', count: { $sum: 1 }}}
			);

			let yearLessonsComplete = Lessons.aggregate(
				{$match: {groupId: groupId, schoolWorkId: {$in: schoolWorkIds}, deletedOn: { $exists: false }, completed: true}},
				{$group: {_id: '$weekId', count: { $sum: 1 }}}
			);

			student.studentId = student._id;
			student.weekProgress = Math.floor(yearLessonsComplete[0].count / yearLessonsTotal[0].count * 100);
			self.added('testStats', Random.id(), student);
		});

		self.ready();
	});
});









