import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Students} from './students.js';
import {primaryInitialIds} from '../../modules/server/initialIds';
import {updatePaths} from '../../modules/server/paths';

Meteor.methods({
	insertStudent(studentProperties) {
		const studentId = Students.insert(studentProperties, (error, result) => {
			console.log(result);

			let pathProperties = {
				studentIds: [result],
				schoolYearIds: [],
				termIds: [],
			};

			updatePaths(pathProperties);
			primaryInitialIds();
		});
		return studentId;
	},

	updateStudent: function(pathProperties, studentId, studentProperties) {
		Students.update(studentId, {$set: studentProperties}, () => {
			updatePaths(pathProperties);
			primaryInitialIds();
		});
	},

	deleteStudent: function(pathProperties, studentId) {
		let deleteDate = new Date();
		Students.update(studentId, {$set: {deletedOn: deleteDate}}, () => {
			Paths.remove({studentId: studentId});
			primaryInitialIds();
		});
	},
})