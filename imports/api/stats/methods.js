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
	getInitialIds(currentYear) {
		if (!this.userId) {
			return false;
		}

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let ids = {};

		let userId = Meteor.users.findOne({'info.groupId': groupId, 'emails.0.verified': true, 'status.active': true}, {sort: {'info.lastName': 1, 'info.firstName': 1}})._id;
		let studentIds = Students.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}}).map((student) => (student._id))


		// Intiial Student
		if (studentIds.length) {ids.studentId = studentIds[0]} else {ids.studentId = 'empty'};


		// Initial School Year
		function schoolYearId(currentYear) {
			if (!SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}).count()) {
				return 'empty'
			}
			if (SchoolYears.findOne({groupId: groupId, startYear: {$gte: currentYear}, deletedOn: { $exists: false }}, {sort: {starYear: 1}})) {
				return SchoolYears.findOne({groupId: groupId, startYear: {$gte: currentYear}, deletedOn: { $exists: false }}, {sort: {starYear: 1}})._id;
			}
			return SchoolYears.findOne({groupId: groupId, startYear: {$lte: currentYear}, deletedOn: { $exists: false }}, {sort: {starYear: 1}})._id;

		};
		ids.schoolYearId = schoolYearId(currentYear);


		// Initial Terms and Weeks
		let initialSchoolYear = SchoolYears.findOne({_id: ids.schoolYearId, groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}, fields: {startYear: 1, endYear: 1}});


		if (ids.schoolYearId === 'empty') {
			ids.termId === 'empty';
			ids.weekId === 'empty';
		} else {
			let schoolWorkIds = SchoolWork.find({ 
				studentId: ids.studentId, 
				schoolYearId: initialSchoolYear._id, 
				deletedOn: { $exists: false }
			}).map(schoolWork => (schoolWork._id));
			let lessons = Lessons.find({schoolWorkId: {$in: schoolWorkIds}, deletedOn: { $exists: false }}, {fields: {completed: 1, assigned: 1, weekId: 1}}).fetch();
			
			let schoolYear = studentSchoolYearsStatusAndPaths(ids.studentId, initialSchoolYear, lessons);

			let valueTerm = schoolYear.firstTermId;
			if (valueTerm) {ids.termId = valueTerm} else {ids.termId = 'empty'};

			let valueWeek = schoolYear.firstWeekId;
			if (valueWeek) {ids.weekId = valueWeek} else {ids.weekId = 'empty'};
		}


		// Initial School Work
		if (ids.schoolYearId === 'empty' || ids.termId === 'empty' || ids.weekId === 'empty') {
			ids.schoolWorkId === 'empty';
		} else {
			let valueSchoolWork = SchoolWork.findOne({groupId: groupId, schoolYearId: ids.schoolYearId, studentId: ids.studentId, deletedOn: { $exists: false }}, {sort: {name: 1}});
			if (valueSchoolWork) {ids.schoolWorkId = valueSchoolWork._id} else {ids.schoolWorkId = 'empty'};
		}


		// Initial User
		if (userId) {ids.userId = userId} else {ids.userId = 'empty'};

		return ids;
	},

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