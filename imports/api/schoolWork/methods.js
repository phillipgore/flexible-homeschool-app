import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {SchoolWork} from './schoolWork.js';
import {Lessons} from '../lessons/lessons.js';

import _ from 'lodash'

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
		let newSchoolWork = [];
		let bulkLessons = [];

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

		let result = SchoolWork.rawCollection().bulkWrite(
			bulkSchoolWork
		).then((schoolWork) => {
			let schoolWorkIds = _.values(schoolWork.insertedIds)
			studentIds.forEach(studentId => {
				SchoolWork.find({_id: {$in: schoolWorkIds}, studentId: studentId}).forEach(schoolWork => {
					newSchoolWork.push({studentId: studentId, schoolWorkId: schoolWork._id});

					lessonProperties.forEach(function(lesson) {
						bulkLessons.push({insertOne: {"document": {
							_id: Random.id(),
							order: lesson.order,
							assigned: false,
							completed: false,
							schoolWorkId: schoolWork._id,
							weekId: lesson.weekId,
							groupId: groupId, 
							userId: userId, 
							createdOn: new Date()
						}}});
					});
				});
			});

			return Lessons.rawCollection().bulkWrite(bulkLessons)
		}).then((schoolWork) => {
			return newSchoolWork;
		}).catch((error) => {
			throw new Meteor.Error(500, error);
		});

		return result;
	},
})