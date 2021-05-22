import {StudentGroups} from './studentGroups.js';
import {Students} from '../students/students.js';

import {upsertPaths} from '../../modules/server/paths';
import {studentGroupsInitialId} from '../../modules/server/initialIds';

Meteor.methods({
	insertStudentGroup(studentGroupProperties) {
		const studentGroupId = StudentGroups.insert(studentGroupProperties);
		
		let pathProperties = {
			studentIds: [studentGroupId],
			schoolYearIds: [],
			termIds: [],
		};

		upsertPaths(pathProperties);
		studentGroupsInitialId()

		return studentGroupId;
	},

	updateStudentGroup(studentGroupId, studentGroupProperties) {
		StudentGroups.update(studentGroupId, {$set: studentGroupProperties});

		let pathProperties = {
			studentIds: [studentGroupId],
			schoolYearIds: [],
			termIds: [],
		};

		upsertPaths(pathProperties);
		studentGroupsInitialId()

		return studentGroupId;
	},
})