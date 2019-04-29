import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Students} from './students.js';
import {primaryInitialIds} from '../../modules/server/initialIds';

Meteor.methods({
	insertStudent(studentProperties) {
		const studentId = Students.insert(studentProperties, () => {
			primaryInitialIds();
		});
		return studentId;
	},

	updateStudent: function(studentId, studentProperties) {
		Students.update(studentId, {$set: studentProperties}, () => {
			primaryInitialIds();
		});
	},

	deleteStudent: function(studentId) {
		let deleteDate = new Date();
		Students.update(studentId, {$set: {deletedOn: deleteDate}}, () => {
			primaryInitialIds();
		});
	},
})