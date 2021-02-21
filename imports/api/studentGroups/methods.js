import {StudentGroups} from './studentGroups.js';
import {Students} from '../students/students.js';

import {studentGroupsInitialId} from '../../modules/server/initialIds';

Meteor.methods({
	insertStudentGroup(groupName, studentIds) {
		const studentGroupId = StudentGroups.insert({name: groupName});
		studentIds.forEach(studentId => {
			Students.update(studentId, {$set: {studentGroupId: studentGroupId}});
		});

		studentGroupsInitialId()

		return studentGroupId;
	},
})