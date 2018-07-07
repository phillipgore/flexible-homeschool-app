import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Subjects} from './subjects.js';
import {Lessons} from '../lessons/lessons.js';

Meteor.methods({
	insertSubject(subjectProperties) {
		const subjectId = Subjects.insert(subjectProperties);
		return subjectId;
	},

	updateSubject: function(subjectId, subjectProperties) {
		Subjects.update(subjectId, {$set: subjectProperties});
		return subjectId;
	},

	deleteSubject: function(subjectId) {
		let lessonIds = Lessons.find({subjectId: subjectId}).map(lesson => (lesson._id));
		
		Subjects.update(subjectId, {$set: {deletedOn: new Date()}});
		lessonIds.forEach(function(lessonId) {
			Lessons.update(lessonId, {$set: {deletedOn: new Date()}});
		});
	},

	batchInsertSubject(studentIds, subjectProperties, lessonProperties) {
		newSubjects = []
		studentIds.forEach(function(studentId) { 
			subjectProperties.studentId = studentId;
			const subjectId = Subjects.insert(subjectProperties);
			newSubjects.push({studentId: studentId, subjectId: subjectId});

			lessonProperties.forEach(function(lesson) {
				lesson.subjectId = subjectId;
				Lessons.insert(lesson);
			});
		});

		return newSubjects;
	},
})