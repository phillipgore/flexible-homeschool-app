import {StudentGroups} from './studentGroups.js';

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
	},
});