import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {SchoolWork} from './schoolWork.js';
import {Lessons} from '../lessons/lessons.js';

Meteor.methods({
	insertSchoolWork(schoolWorkProperties) {
		const schoolWorkId = SchoolWork.insert(schoolWorkProperties);
		return schoolWorkId;
	},

	updateSchoolWork: function(schoolWorkId, schoolWorkProperties) {
		SchoolWork.update(schoolWorkId, {$set: schoolWorkProperties});
		return schoolWorkId;
	},

	deleteSchoolWork: function(schoolWorkId) {
		let lessonIds = Lessons.find({schoolWorkId: schoolWorkId}).map(lesson => (lesson._id));
		
		SchoolWork.update(schoolWorkId, {$set: {deletedOn: new Date()}});
		lessonIds.forEach(function(lessonId) {
			Lessons.update(lessonId, {$set: {deletedOn: new Date()}});
		});
	},

	batchInsertSchoolWork(studentIds, schoolWorkProperties, lessonProperties) {
		newSchoolWork = []
		studentIds.forEach(function(studentId) { 
			schoolWorkProperties.studentId = studentId;
			const schoolWorkId = SchoolWork.insert(schoolWorkProperties);
			newSchoolWork.push({studentId: studentId, schoolWorkId: schoolWorkId});

			lessonProperties.forEach(function(lesson) {
				lesson.schoolWorkId = schoolWorkId;
				Lessons.insert(lesson);
			});
		});

		return newSchoolWork;
	},
})