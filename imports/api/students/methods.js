import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Students} from './students.js';

Meteor.methods({
	insertStudent(studentProperties) {
		const studentId = Students.insert(studentProperties);
		return studentId;
	},

	updateStudent: function(studentId, studentProperties) {
		Students.update(studentId, {$set: studentProperties});
	},

	deleteStudent: function(studentId) {
		Students.update(studentId, {$set: {deleted: true}});
	}
})