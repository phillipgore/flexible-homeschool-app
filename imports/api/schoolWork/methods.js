import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {SchoolWork} from './schoolWork.js';
import {Lessons} from '../lessons/lessons.js';

Meteor.methods({
	// insertSchoolWork(schoolWorkProperties) {
	// 	const schoolWorkId = SchoolWork.insert(schoolWorkProperties);
	// 	return schoolWorkId;
	// },

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

	insertSchoolWork(studentIds, schoolWorkProperties, lessonProperties) {
		let groupId = Meteor.user().info.groupId;
		let userId = Meteor.userId();

		let bulkSchoolWork = [];

		studentIds.forEach(function(studentId) { 
			bulkSchoolWork.push({insertOne: {"document": {
				_id: Random.id(),
				name: schoolWorkProperties.name,
				description: schoolWorkProperties.description,
				resources: schoolWorkProperties.resources,
				studentId: studentId,
				schoolYearId: schoolWorkProperties.schoolYearId,
				groupId: groupId, 
				userId: userId, 
				createdOn: new Date()
			}}});
		});

		SchoolWork.rawCollection().bulkWrite(
			bulkSchoolWork
		).then((schoolWork) => {
			console.log(schoolWork.insertedIds)
		}).catch((error) => {
			throw new Meteor.Error(500, error.raw.message);
		});

		return false;

		studentIds.forEach(function(studentId) { 
			schoolWorkProperties.studentId = studentId;
			const schoolWorkId = SchoolWork.insert(schoolWorkProperties);
			newSchoolWork.push({studentId: studentId, schoolWorkId: schoolWorkId});

			lessonProperties.forEach(function(lesson) {
				lesson.schoolWorkId = schoolWorkId;
			});

			Lessons.batchInsert(lessonProperties);
		});


		return newSchoolWork;
	},
})