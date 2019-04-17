import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {Students} from '../students/students.js';
import {SchoolYears} from '../schoolYears/schoolYears.js';
import {Resources} from '../resources/resources.js';
import {SchoolWork} from '../schoolWork/schoolWork.js';
import {Weeks} from '../weeks/weeks.js';
import {Lessons} from '../lessons/lessons.js';
import {Reports} from '../reports/reports.js';

import {studentSchoolYearsStatusAndPaths} from '../../modules/server/functions';
import _ from 'lodash'


Meteor.methods({
	getProgressStats(schoolYearId, termId, weekId) {
		if (!this.userId) {
			return false;
		}

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;

		let students = Students.find({groupId: groupId, deletedOn: { $exists: false }}, {fields: {_id: 1}});
		let lessons = Lessons.find({schoolYearId: schoolYearId, deletedOn: { $exists: false }}, {fields: {completed: 1, studentId: 1, termId: 1, weekId: 1}}).fetch();
		
		let progressStats = []

		students.forEach((student, index) => {

			// Function for correctly rounding the percentage of completed lessons.
			function rounding(complete, total) {
				if(complete && total) {
					let percentComplete = complete / total * 100
					if (percentComplete > 0 && percentComplete < 1) {
						return 1;
					}
					return Math.floor(percentComplete);
				}
				return 0;
			}


			// School Year stats.
			let yearLessons = _.filter(lessons, ['studentId', student._id]);
			let yearLessonsTotal = yearLessons.length
			let yearLessonsComplete = _.filter(yearLessons, ['completed', true]).length;

			let yearPercentComplete = rounding(yearLessonsComplete, yearLessonsTotal);


			// Term stats.
			let termLessons = _.filter(yearLessons, ['termId', termId]);
			let termLessonsTotal = termLessons.length;
			let termLessonsComplete = _.filter(termLessons, ['completed', true]).length;

			let termPercentComplete = rounding(termLessonsComplete, termLessonsTotal);


			// Week stats.
			let weekLessons = _.filter(termLessons, ['weekId', weekId]);
			let weekLessonsTotal = weekLessons.length;
			let weekLessonsComplete = _.filter(weekLessons, ['completed', true]).length;

			let weekPercentComplete = rounding(weekLessonsComplete, weekLessonsTotal);

			//Stats Push
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