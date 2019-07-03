import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Students} from '../students/students.js';
import {SchoolYears} from '../schoolYears/schoolYears.js';
import {Resources} from '../resources/resources.js';
import {SchoolWork} from './schoolWork.js';
import {Lessons} from '../lessons/lessons.js';
import {upsertStats} from '../../modules/server/stats';
import {upsertPaths} from '../../modules/server/paths';
import {upsertSchoolWorkPaths} from '../../modules/server/paths';
import {primaryInitialIds} from '../../modules/server/initialIds';

import _ from 'lodash'

Meteor.methods({
	getSchoolWorkInfo: function(schoolWorkId) {
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let info = {};
		let resourceInfo = [];

		info.description = SchoolWork.findOne({_id: schoolWorkId, groupId: groupId}).description;

		let resourceIds = _.flattenDeep(SchoolWork.find({_id: schoolWorkId, groupId: groupId}).map(schoolWork => schoolWork.resources));
		let resources = Resources.find({groupId: groupId, _id: {$in: resourceIds}}, {sort: {title: 1}, fields: {title: 1, type: 1, link: 1}});
		resources.forEach(resource => {
			resourceInfo.push({_id: resource._id, title: resource.title, type: resource.type, link: resource.link})
		})

		info.resources = resourceInfo;

		return info;
	},

	updateSchoolWork: function(updateSchoolWorkProperties, removeLessonIds, insertLessonProperties) {
		let groupId = Meteor.user().info.groupId;
		let userId = Meteor.userId();

		let schoolWorkId = SchoolWork.update(updateSchoolWorkProperties._id, {$set: updateSchoolWorkProperties});
		let bulkLessons = []

		if (insertLessonProperties.length) {
			insertLessonProperties.forEach(lesson => {
				bulkLessons.push({insertOne: {"document": {
					_id: Random.id(),
					order: lesson.order,
					assigned: false,
					completed: false,
					studentId: lesson.studentId,
					schoolYearId: lesson.schoolYearId,
					schoolWorkId: lesson.schoolWorkId,
					termId: lesson.termId,
					termOrder: lesson.termOrder,
					weekId: lesson.weekId,
					weekOrder: lesson.weekOrder,
					groupId: groupId, 
					userId: userId, 
					createdOn: new Date()
				}}});
			})
		}

		if (removeLessonIds.length) {
			removeLessonIds.forEach(lessonId => {
				bulkLessons.push({deleteOne: {"filter": {
					_id: lessonId
				}}});
			})
		}

		if (bulkLessons.length) {
			let result = Lessons.rawCollection().bulkWrite(
				bulkLessons
			).then((lessons) => {
				return lessons;
			}).catch((error) => {
				throw new Meteor.Error(500, error);
			});
		}
	},

	deleteSchoolWork: function(schoolWorkId) {
		let lessonIds = Lessons.find({schoolWorkId: schoolWorkId}).map(lesson => (lesson._id));

		SchoolWork.remove({_id: schoolWorkId});
		Lessons.remove({_id: {$in: lessonIds}});
	},

	insertSchoolWork: function(studentIds, schoolWorkProperties, lessonProperties) {
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
							studentId: studentId,
							schoolYearId: lesson.schoolYearId,
							termId: lesson.termId,
							weekId: lesson.weekId,
							schoolWorkId: schoolWork._id,
							termOrder: lesson.termOrder,
							weekOrder: lesson.weekOrder,
							groupId: groupId, 
							userId: userId, 
							createdOn: new Date()
						}}});
					});
				});
			});
			if (lessonProperties.length) {
				return Lessons.rawCollection().bulkWrite(bulkLessons)
			}
			return [];
		}).then((schoolWork) => {
			return newSchoolWork;
		}).catch((error) => {
			throw new Meteor.Error(500, error);
		});

		return result;
	},
});





