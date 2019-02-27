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
		let schoolWork = SchoolWork.find({groupId: groupId, schoolYearId: schoolYearId, deletedOn: { $exists: false }}, {fields: {_id: 1, completed: 1, studentId: 1}}).fetch();
		let termWeeksIds = Weeks.find({termId: termId, deletedOn: { $exists: false }}).map(week => (week._id));
		let lessons = Lessons.find({schoolWorkId: {$in: schoolWork.map(work => work._id)}, deletedOn: { $exists: false }}).fetch();

		let progressStats = []

		students.forEach((student, index) => {
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

			let schoolWorkIds = _.filter(schoolWork, ['studentId', student._id]).map(work => work._id);

			// School Year
			let yearLessons = _.filter(lessons, lesson => _.includes(schoolWorkIds, lesson.schoolWorkId));
			let yearLessonsTotal = yearLessons.length
			let yearLessonsComplete = _.filter(yearLessons, ['completed', true]).length;

			let yearPercentComplete = rounding(yearLessonsComplete, yearLessonsTotal);


			// Term
			let termLessons = _.filter(yearLessons, lesson => _.includes(termWeeksIds, lesson.weekId));
			let termLessonsTotal = termLessons.length;
			let termLessonsComplete = _.filter(termLessons, ['completed', true]).length;

			let termPercentComplete = rounding(termLessonsComplete, termLessonsTotal);


			// Week
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