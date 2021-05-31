import {StudentGroups} from './studentGroups.js';

import {studentGroupsInitialId} from '../../modules/server/initialIds';

Meteor.methods({
	insertStudentGroup(studentGroupProperties) {
		const studentGroupId = StudentGroups.insert(studentGroupProperties);
		studentGroupsInitialId()

		return studentGroupId;
	},

	updateStudentGroup(studentGroupId, studentGroupProperties) {
		StudentGroups.update(studentGroupId, {$set: studentGroupProperties});
		studentGroupsInitialId()
	},

	deleteStudentGroup(studentGroupId) {
		StudentGroups.remove({_id: studentGroupId});
	},
});