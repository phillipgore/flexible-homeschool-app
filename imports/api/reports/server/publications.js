import {Reports} from '../reports.js';
import {Students} from '../../students/students.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Terms} from '../../terms/terms.js';
import {Weeks} from '../../weeks/weeks.js';
import {Subjects} from '../../subjects/subjects.js';
import {Resources} from '../../resources/resources.js';
import {Lessons} from '../../lessons/lessons.js';

import {minutesConvert} from '../../../modules/server/functions';
import _ from 'lodash'

Meteor.publish('allReports', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Reports.find({groupId: groupId, deletedOn: { $exists: false }});
});

Meteor.publish('report', function(reportId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Reports.find({_id: reportId, groupId: groupId, deletedOn: { $exists: false }});
});

Meteor.publish('reportSchoolYears', function(schoolYearId, studentId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let student = Students.findOne({_id: studentId, groupId: groupId, deletedOn: { $exists: false }});
		let schoolYear = SchoolYears.findOne({_id: schoolYearId, groupId: groupId, deletedOn: { $exists: false }});

		if (student && schoolYear) {
			let stats = {}

			let termIds = Terms.find({groupId: groupId, schoolYearId: schoolYearId, deletedOn: { $exists: false }}).map(term => (term._id));
			let subjectIds = Subjects.find({groupId: groupId, schoolYearId: schoolYearId, studentId: studentId, deletedOn: { $exists: false }}).map(subject => (subject._id));

			let terms = Terms.find({groupId: groupId, schoolYearId: schoolYearId, deletedOn: { $exists: false }});
			let weeks = Weeks.find({groupId: groupId, termId: {$in: termIds}, deletedOn: { $exists: false }});
			let subjects = Subjects.find({groupId: groupId, schoolYearId: schoolYearId, studentId: studentId, deletedOn: { $exists: false }});
			let lessons = Lessons.find({groupId: groupId, subjectId: {$in: subjectIds}, deletedOn: { $exists: false }});

			// School Year
			let lessonsTotal = lessons.count();
			let lessonsCompletedTotal = Lessons.find({completed: true, groupId: groupId, subjectId: {$in: subjectIds}, deletedOn: { $exists: false }}).count();
			let percentComplete = lessonsCompletedTotal / lessonsTotal * 100;

			let lessonsIncompleteTotal = Lessons.find({completed: false, groupId: groupId, subjectId: {$in: subjectIds}, deletedOn: { $exists: false }}).count();
			let lessonCompletionTimes = Lessons.find({completed: true, groupId: groupId, subjectId: {$in: subjectIds}, deletedOn: { $exists: false }}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
			
			// Average Term
			let completedWeekIds = Lessons.find({completed: true, groupId: groupId, subjectId: {$in: subjectIds}, deletedOn: { $exists: false }}).map(lesson => (lesson.weekId));
			let completedTermIds = Weeks.find({_id: {$in: completedWeekIds}, deletedOn: { $exists: false }}).map(week => (week.termId));
			let termsTotal = Terms.find({_id: {$in: completedTermIds}}).count();
			let averageTermMinutes = _.sum(lessonCompletionTimes) / termsTotal;
			
			// Average Week
			let weeksTotal = Weeks.find({_id: {$in: completedWeekIds}, deletedOn: { $exists: false }}).count();
			let averageWeekMinutes = _.sum(lessonCompletionTimes) / weeksTotal;
			
			// Average Lesson
			let totalTimeMinutes = _.sum(lessonCompletionTimes);
			let averageLessonMinutes = _.sum(lessonCompletionTimes) / lessonsCompletedTotal;

			function progress(percentComplete) {
				if (percentComplete > 0 && percentComplete < 1) {
					return 1;
				} 
				return Math.floor(percentComplete);
			};

			function progressStatus(lessonsIncompleteTotal) {
				if (!lessonsIncompleteTotal) {
					return true;
				} 
				return false;
			};

			stats.startYear = schoolYear.startYear,
			stats.endYear = schoolYear.endYear,
			stats.termCount = terms.count(),
			stats.subjectCount = subjects.count(),
			stats.weekCount = weeks.count(),
			stats.lessonCount = lessons.count(),
			stats.progress = progress(percentComplete),
			stats.progressComplete = progressStatus(lessonsIncompleteTotal),
			stats.totalTime = minutesConvert(totalTimeMinutes),
			stats.averageLessons = minutesConvert(averageLessonMinutes),
			stats.averageWeeks = minutesConvert(averageWeekMinutes),
			stats.averageTerms = minutesConvert(averageTermMinutes),


			self.added('schoolYears', schoolYear._id, stats);
		}
		self.ready();
	});
});

Meteor.publish('reportTerms', function(schoolYearId, studentId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let student = Students.findOne({_id: studentId, groupId: groupId, deletedOn: { $exists: false }});
		let schoolYear = SchoolYears.findOne({_id: schoolYearId, groupId: groupId, deletedOn: { $exists: false }});

		if (student && schoolYear) {
			let terms = Terms.find({groupId: groupId, schoolYearId: schoolYearId});

			// Terms
			terms.forEach((term) => {
				let stats = {};

				let weekIds = Weeks.find({groupId: groupId, termId: term._id, deletedOn: { $exists: false }}).map(week => (week._id));
				let lessonIds = _.uniq(Lessons.find({groupId: groupId, weekId: {$in: weekIds}, deletedOn: { $exists: false }}).map(lesson => (lesson.subjectId)));
				let subjects = Subjects.find({_id: {$in: lessonIds}, studentId: studentId, schoolYearId: schoolYearId, groupId: groupId, deletedOn: { $exists: false }});
				let subjectIds = subjects.map(subject => (subject._id));
				let lessons = Lessons.find({groupId: groupId, subjectId: {$in: subjectIds}, weekId: {$in: weekIds}, deletedOn: { $exists: false }})

				stats.order = term.order;
				stats.schoolYearId = schoolYearId;
				stats.subjectCount = subjects.count();
				stats.weekCount = weekIds.length;
				stats.lessonCount = lessons.count();

				// Term Progress
				let lessonsTotal = lessons.count();
				let lessonsCompletedTotal = Lessons.find({groupId: groupId, subjectId: {$in: subjectIds}, weekId: {$in: weekIds}, completed: true, deletedOn: { $exists: false }}).count();
				let percentComplete = lessonsCompletedTotal / lessonsTotal * 100;
				if (percentComplete > 0 && percentComplete < 1) {
					stats.progress =  1;
				} else {
					stats.progress = Math.floor(percentComplete);
				}

				// Term Progress Status
				let lessonsIncompleteTotal = Lessons.find({groupId: groupId, subjectId: {$in: subjectIds}, weekId: {$in: weekIds}, completed: false, deletedOn: { $exists: false }}).count();
				if (!lessonsIncompleteTotal) {
					stats.progressComplete = true;
				} else {
					stats.progressComplete = false;
				}

				// Term Total Time
				let lessonCompletionTimes = Lessons.find({groupId: groupId, subjectId: {$in: subjectIds}, weekId: {$in: weekIds}, completed: true, deletedOn: { $exists: false }}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
				let totalMinutes = _.sum(lessonCompletionTimes);
				stats.totalTime = minutesConvert(totalMinutes);

				//  Terms Average Weeks
				let completedWeekIds = Lessons.find({groupId: groupId, subjectId: {$in: subjectIds}, weekId: {$in: weekIds}, completed: true, deletedOn: { $exists: false }}).map(lesson => (lesson.weekId));
				let weeksTotal = Weeks.find({_id: {$in: completedWeekIds}}).count();
				let averageWeekMinutes = _.sum(lessonCompletionTimes) / weeksTotal;
				stats.averageWeeks = minutesConvert(averageWeekMinutes);

				//  Terms Average Lessons
				let averageLessonMinutes = _.sum(lessonCompletionTimes) / lessonCompletionTimes.length;
				stats.averageLessons = minutesConvert(averageLessonMinutes);

				// stats.push(termStats);
				self.added('terms', term._id, stats);
			});
		}

		self.ready();
	});
});

Meteor.publish('reportSubjects', function(schoolYearId, studentId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let student = Students.findOne({_id: studentId, groupId: groupId, deletedOn: { $exists: false }});
		let schoolYear = SchoolYears.findOne({_id: schoolYearId, groupId: groupId, deletedOn: { $exists: false }});

		if (student && schoolYear) {
			let subjects = Subjects.find({groupId: groupId, schoolYearId: schoolYearId, studentId: studentId, deletedOn: { $exists: false }});

			// Subjects
			subjects.forEach((subject) => {
				let stats = {};
				let weekIds = Lessons.find({groupId: groupId, subjectId: subject._id, deletedOn: { $exists: false }}).map(lesson => (lesson.weekId));

				stats.order = subject.order;
				stats.name = subject.name;
				stats.description = subject.description;
				stats.resources= subject.resources;
				stats.studentId = studentId;
				stats.schoolYearId = schoolYearId;
				stats.termCount = _.uniq( Weeks.find({_id: {$in: weekIds}, groupId: groupId, deletedOn: { $exists: false }}).map(week => (week.termId)) ).length;
				stats.weekCount = _.uniq( Lessons.find({groupId: groupId, subjectId: subject._id, deletedOn: { $exists: false }}).map(lesson => (lesson.weekId)) ).length;
				stats.lessonCount = Lessons.find({groupId: groupId, subjectId: subject._id, deletedOn: { $exists: false }}).count();

				// Subjects Progress
				let lessonsTotal = Lessons.find({groupId: groupId, subjectId: subject._id, deletedOn: { $exists: false }}).count();
				let lessonsCompletedTotal = Lessons.find({groupId: groupId, subjectId: subject._id, completed: true, deletedOn: { $exists: false }}).count();
				let percentComplete = lessonsCompletedTotal / lessonsTotal * 100;
				if (percentComplete > 0 && percentComplete < 1) {
					stats.progress = 1;
				} else {
					stats.progress = Math.floor(percentComplete);
				}

				// Subjects Progress Status
				let lessonsIncompleteTotal = Lessons.find({groupId: groupId, subjectId: subject._id, completed: false, deletedOn: { $exists: false }}).count();
				if (!lessonsIncompleteTotal) {
					stats.progressComplete = true;
				} else {
					stats.progressComplete = false;
				}

				// Subjects Total Time
				let lessonCompletionTimes = Lessons.find({groupId: groupId, subjectId: subject._id, completed: true, deletedOn: { $exists: false }}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
				let totalMinutes = _.sum(lessonCompletionTimes);
				stats.totalTime = minutesConvert(totalMinutes);

				// Subjects Average Lesssons
				let averageLessonsMinutes = _.sum(lessonCompletionTimes) / lessonCompletionTimes.length;
				stats.averageLessons = minutesConvert(averageLessonsMinutes);

				// Subjects Average Weeks
				let weeksTotal = _.uniq( Lessons.find({groupId: groupId, subjectId: subject._id, completed: true, deletedOn: { $exists: false }}).map(lesson => (lesson.weekId)) ).length;
				let averageWeekMinutes = _.sum(lessonCompletionTimes) / weeksTotal;
				stats.averageWeeks = minutesConvert(averageWeekMinutes); 

				// Subjects Average Terms
				let completedWeekIds = _.uniq( Lessons.find({groupId: groupId, subjectId: subject._id, completed: true, deletedOn: { $exists: false }}).map(lesson => (lesson.weekId)) );
				let termsTotal = _.uniq( Weeks.find({_id: {$in: completedWeekIds}, deletedOn: { $exists: false }}).map(week => (week.termId)) ).length;
				let averageTermMinutes = _.sum(lessonCompletionTimes) / termsTotal;
				stats.averageTerms = minutesConvert(averageTermMinutes);

				self.added('subjects', subject._id, stats);
			});
		}

		self.ready();
	});
});

Meteor.publish('reportResources', function(schoolYearId, studentId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let student = Students.findOne({_id: studentId, groupId: groupId, deletedOn: { $exists: false }});
		let schoolYear = SchoolYears.findOne({_id: schoolYearId, groupId: groupId, deletedOn: { $exists: false }});

		if (student && schoolYear) {
			let resourceIds = _.flatten( Subjects.find({groupId: groupId, schoolYearId: schoolYearId, studentId: studentId, deletedOn: { $exists: false }}).map(subject => (subject.resources)) );
			let resources = Resources.find({_id: {$in: resourceIds}, groupId: groupId, deletedOn: { $exists: false }});

			resources.map((rescource) => {
				self.added('resources', rescource._id, rescource);
			});
		}

		self.ready();
	});
});










