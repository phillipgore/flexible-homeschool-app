import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Students} from '../students/students.js';
import {SchoolWork} from '../schoolWork/schoolWork.js';
import {Weeks} from '../weeks/weeks.js';
import {Lessons} from './lessons.js';


Meteor.methods({
	updateLesson: function(lessonProperties) {
		Lessons.update(lessonProperties._id, {$set: lessonProperties});
	},

	batchInsertLessons(lessonProperties) {
		lessonProperties.forEach(function(lesson, index) { 
			Lessons.insert(lesson);
		});
	},

	batchUpdateLessons: function(lessonProperties) {
		lessonProperties.forEach(function(lesson, index) {
			Lessons.update(lesson._id, {$set: lesson});
		});
	},

	batchRemoveLessons: function(lessonIds) {
		lessonIds.forEach(function(lessonId, index) {
			Lessons.remove(lessonId);
		});
	},



	getProgressStats(schoolYearId, termId, weekId) {
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let students = Students.find({groupId: groupId, deletedOn: { $exists: false }}, {fields: {_id: 1}});

		let progressStats = []

		students.forEach((student) => {
			let schoolWorkIds = SchoolWork.find({studentId: student._id, schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(schoolWork => (schoolWork._id));

			// School Year
			let yearLessonsTotal = Lessons.aggregate(
				{$match: {schoolWorkId: {$in: schoolWorkIds}, deletedOn: { $exists: false }}},
				{$group: {_id: '$schoolYearId', count: { $sum: 1 }}}
			);

			let yearLessonsComplete = Lessons.aggregate(
				{$match: {schoolWorkId: {$in: schoolWorkIds}, deletedOn: { $exists: false }, completed: true}},
				{$group: {_id: '$schoolYearId', count: { $sum: 1 }}}
			);

			let yearPercentComplete = Math.floor(yearLessonsComplete[0].count / yearLessonsTotal[0].count * 100);


			// Term
			let termWeeksIds = Weeks.find({termId: termId, deletedOn: { $exists: false }}).map(week => (week._id));

			let termLessonsTotal = Lessons.aggregate(
				{$match: {schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: termWeeksIds}, deletedOn: { $exists: false }}},
				{$group: {_id: '$termId', count: { $sum: 1 }}}
			);

			let termLessonsComplete = Lessons.aggregate(
				{$match: {schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: termWeeksIds}, deletedOn: { $exists: false }, completed: true}},
				{$group: {_id: '$termId', count: { $sum: 1 }}}
			);

			let termPercentComplete = Math.floor(termLessonsComplete[0].count / termLessonsTotal[0].count * 100);


			// Week
			let weekLessonsTotal = Lessons.aggregate(
				{$match: {schoolWorkId: {$in: schoolWorkIds}, weekId: weekId, deletedOn: { $exists: false }}},
				{$group: {_id: '$weekId', count: { $sum: 1 }}}
			);

			let weekLessonsComplete = Lessons.aggregate(
				{$match: {schoolWorkId: {$in: schoolWorkIds}, weekId: weekId, deletedOn: { $exists: false }, completed: true}},
				{$group: {_id: '$weekId', count: { $sum: 1 }}}
			);

			let weekPercentComplete = Math.floor(weekLessonsComplete[0].count / weekLessonsTotal[0].count * 100);

			progressStats.push({
				studentId: student._id,
				yearProgress: yearPercentComplete,
				termProgress: termPercentComplete,
				weekProgress: weekPercentComplete,
			})
		});
		
		return progressStats;
	},
})