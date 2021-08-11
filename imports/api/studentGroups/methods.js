import {StudentGroups} from './studentGroups.js';
import {Subjects} from '../../api/subjects/subjects.js';
import {SchoolWork} from '../../api/schoolWork/schoolWork.js';
import {Lessons} from '../../api/lessons/lessons.js';
import {Stats} from '../../api/stats/stats.js';
import {Paths} from '../../api/paths/paths.js';

import {primaryInitialIds} from '../../modules/server/initialIds';

Meteor.methods({
	insertStudentGroup(studentGroupProperties) {
		const studentGroupId = StudentGroups.insert(studentGroupProperties);
		primaryInitialIds()

		return studentGroupId;
	},

	updateStudentGroup(studentGroupId, studentGroupProperties) {
		StudentGroups.update(studentGroupId, {$set: studentGroupProperties});
		primaryInitialIds()
	},

	deleteStudentGroup(studentGroupId) {
		StudentGroups.remove({_id: studentGroupId});
		Subjects.remove({studentGroupId: studentGroupId});
		SchoolWork.remove({studentGroupId: studentGroupId});
		Lessons.remove({studentGroupId: studentGroupId});
		Stats.remove({studentGroupId: studentGroupId});
		Paths.remove({studentGroupId: studentGroupId});
	},
});