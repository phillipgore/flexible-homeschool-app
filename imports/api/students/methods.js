import {Students} from './students.js';
import {StudentGroups} from '../../api/studentGroups/studentGroups.js';
import {Paths} from '../../api/paths/paths.js';
import {Stats} from '../../api/stats/stats.js';
import {SchoolWork} from '../schoolWork/schoolWork.js';
import {Lessons} from '../lessons/lessons.js';

import {primaryInitialIds} from '../../modules/server/initialIds';
import {upsertPaths} from '../../modules/server/paths';

Meteor.methods({
	insertStudent(studentProperties) {
		const studentId = Students.insert(studentProperties, (error, result) => {
			let pathProperties = {
				studentIds: [result],
				studentGroupIds: [],
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
		let schoolWorkIds = SchoolWork.find({studentId: studentId}).map(schoolWork => schoolWork._id);
		let lessonIds = Lessons.find({schoolWorkId: {$in: schoolWorkIds}}).map(lesson => lesson._id);

		Students.remove({_id: studentId});
		StudentGroups.update({}, {$pull: {studentIds: studentId}}, { multi: true });
		SchoolWork.remove({_id: {$in: schoolWorkIds}});
		Lessons.remove({_id: {$in: lessonIds}});

		Stats.remove({studentId: studentId});
		Paths.remove({studentId: studentId});
	},
})