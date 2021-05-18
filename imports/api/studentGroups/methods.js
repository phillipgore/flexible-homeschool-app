import {StudentGroups} from './studentGroups.js';
import {Students} from '../students/students.js';

import {upsertPaths} from '../../modules/server/paths';
import {studentGroupsInitialId} from '../../modules/server/initialIds';

Meteor.methods({
	insertStudentGroup(groupName, studentIds) {
		const studentGroupId = StudentGroups.insert({name: groupName});
		studentIds.forEach(studentId => {
			Students.update(studentId, {$push: {studentGroupIds: studentGroupId}});
		});
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