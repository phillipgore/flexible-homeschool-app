import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Students} from './students.js';
import {SchoolWork} from '../schoolWork/schoolWork.js';
import {Lessons} from '../lessons/lessons.js';

Meteor.methods({
	insertStudent(studentProperties) {
		const studentId = Students.insert(studentProperties);
		return studentId;
	},

	updateStudent: function(studentId, studentProperties) {
		Students.update(studentId, {$set: studentProperties});
	},

	deleteStudent: function(studentId) {
		let schoolWorkIds = SchoolWork.find({studentId: studentId}).map(schoolWork => schoolWork._id);
		let lessonIds = Lessons.find({schoolWorkId: {$in: schoolWorkIds}}).map(lesson => lesson._id);

		Students.remove({_id: studentId});
		SchoolWork.remove({_id: {$in: schoolWorkIds}});
		Lessons.remove({_id: {$in: lessonIds}});
	},
})