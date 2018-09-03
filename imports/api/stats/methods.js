import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Students} from '../students/students.js';
import {SchoolWork} from '../schoolWork/schoolWork.js';
import {Weeks} from '../weeks/weeks.js';
import {Lessons} from '../lessons/lessons.js';

import _ from 'lodash'


Meteor.methods({
	getProgressStats(schoolYearId, termId, weekId) {
		if (!this.userId) {
			return false;
		}
		
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let students = Students.find({groupId: groupId, deletedOn: { $exists: false }}, {fields: {_id: 1}});

		let progressStats = []

		students.forEach((student) => {
			function rounding(complete, total) {
				if(complete && total) {
					let percentComplete = complete.count / total.count * 100
					if (percentComplete > 0 && percentComplete < 1) {
						return 1;
					}
					return Math.floor(percentComplete);
				}
				return 0;
			}

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

			let yearPercentComplete = rounding(yearLessonsComplete[0], yearLessonsTotal[0]);


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

			let termPercentComplete = rounding(termLessonsComplete[0], termLessonsTotal[0]);


			// Week
			let weekLessonsTotal = Lessons.aggregate(
				{$match: {schoolWorkId: {$in: schoolWorkIds}, weekId: weekId, deletedOn: { $exists: false }}},
				{$group: {_id: '$weekId', count: { $sum: 1 }}}
			);

			let weekLessonsComplete = Lessons.aggregate(
				{$match: {schoolWorkId: {$in: schoolWorkIds}, weekId: weekId, deletedOn: { $exists: false }, completed: true}},
				{$group: {_id: '$weekId', count: { $sum: 1 }}}
			);

			let weekPercentComplete = rounding(weekLessonsComplete[0], weekLessonsTotal[0]);

			progressStats.push({
				studentId: student._id,
				yearProgress: yearPercentComplete,
				termProgress: termPercentComplete,
				weekProgress: weekPercentComplete,
			});
		});
		
		return progressStats;
	},
})