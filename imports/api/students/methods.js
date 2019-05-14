import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Students} from './students.js';
import {Paths} from '../../api/paths/paths.js';
import {Stats} from '../../api/stats/stats.js';
import {primaryInitialIds} from '../../modules/server/initialIds';
import {upsertPaths} from '../../modules/server/paths';

Meteor.methods({
	insertStudent(studentProperties) {
		const studentId = Students.insert(studentProperties, (error, result) => {
			let pathProperties = {
				studentIds: [result],
				schoolYearIds: [],
				termIds: [],
			};

			upsertPaths(pathProperties);
			primaryInitialIds();
		});
		return studentId;
	},

	updateStudent: function(pathProperties, studentId, studentProperties) {
		Students.update(studentId, {$set: studentProperties}, () => {
			upsertPaths(pathProperties);
			primaryInitialIds();
		});
	},

	deleteStudent: function(studentId) {
		let deleteDate = new Date();
		Students.update(studentId, {$set: {deletedOn: deleteDate}}, () => {
			Stats.remove({timeFrameId: studentId});
			Paths.remove({timeFrameId: studentId});
			primaryInitialIds();
		});
	},
})