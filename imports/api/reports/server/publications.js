import {Reports} from '../reports.js';
import {Students} from '../../students/students.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Terms} from '../../terms/terms.js';
import {Weeks} from '../../weeks/weeks.js';
import {SchoolWork} from '../../schoolWork/schoolWork.js';
import {Resources} from '../../resources/resources.js';
import {Lessons} from '../../lessons/lessons.js';

import {minutesConvert} from '../../../modules/server/functions';
import _ from 'lodash'

Meteor.publish('allReports', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Reports.find({groupId: groupId, deletedOn: { $exists: false }}, {fields: {name: 1}});
});

Meteor.publish('report', function(reportId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Reports.find({_id: reportId, groupId: groupId, deletedOn: { $exists: false }});
});

Meteor.publish('reportData', function(studentId, schoolYearId, TermId, WeekId, reportId) {
	if (!this.userId) {
		return this.ready();
	}
	console.log(studentId +" "+ schoolYearId +" "+ TermId +" "+ WeekId +" "+ reportId)
	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;

	let report = Reports.findOne({_id: reportId, groupId: groupId, deletedOn: { $exists: false }});
	let schoolYear = SchoolYears.findOne({_id: schoolYearId, groupId: groupId, deletedOn: { $exists: false }});
	
	let terms = Terms.find({groupId: groupId, schoolYearId: schoolYearId, deletedOn: { $exists: false }});
	let weeks = Weeks.find({groupId: groupId, termId: {$in: terms.map(term => (term._id))}, deletedOn: { $exists: false }});
	let schoolWork = SchoolWork.find({groupId: groupId, schoolYearId: schoolYearId, studentId: studentId, deletedOn: { $exists: false }});
	let lessons = Lessons.find({groupId: groupId, schoolWorkId: {$in: schoolWork.map(schoolWork => (schoolWork._id))}, deletedOn: { $exists: false }});

	let lessonCompletionTimes = _.filter(lessons, ['completed', true]).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
	let lessonsCompletedTotal = _.filter(lessons, ['completed', true]).length;
	
	if (report.schoolYearReportVisible) {
		let stats = {};

		stats.startYear = schoolYear.startYear;
		stats.endYear = schoolYear.endYear;

		let yearLessonsTotal = lessons.length;
		let yearLessonsCompletedTotal = _.filter(lessons, ['completed', true]).length;
		let yearPercentComplete = yearLessonsCompletedTotal / yearLessonsTotal * 100;
		let yearLessonsIncompletedTotal = _.filter(lessons, ['completed', false]).length;

		if (report.schoolYearStatsVisible) {
			stats.termCount = terms.count();
			stats.schoolWorkCount = schoolWork.count();
			stats.weekCount = weeks.count();
			stats.lessonCount = lessons.count();
		}

		if (report.schoolYearProgressVisible) {
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

			stats.progress = progress(yearPercentComplete);
			stats.progressComplete = progressStatus(yearLessonsIncompletedTotal);
		}
		if (report.schoolYearTimesVisible) {
			let completedWeekIds = _.filter(lessons, ['completed', true]).map(lesson => (lesson.weekId));
			let completedTermIds = Weeks.find({_id: {$in: completedWeekIds}, deletedOn: { $exists: false }}).map(week => (week.termId));
			let termsTotal = Terms.find({_id: {$in: completedTermIds}}).count();			
			let weeksTotal = completedWeekIds.length;

			let totalTimeMinutes = _.sum(lessonCompletionTimes);
			let averageTermMinutes = _.sum(lessonCompletionTimes) / termsTotal;
			let averageWeekMinutes = _.sum(lessonCompletionTimes) / weeksTotal;
			let averageLessonMinutes = _.sum(lessonCompletionTimes) / lessonsCompletedTotal;

			stats.totalTime = minutesConvert(totalTimeMinutes);
			stats.averageLessons = minutesConvert(averageLessonMinutes);
			stats.averageWeeks = minutesConvert(averageWeekMinutes);
			stats.averageTerms = minutesConvert(averageTermMinutes);
		}
		console.log(stats)
	}

	if (report.termsReportVisible) {
		console.log('Terms Report')

		if (report.termsStatsVisible) {
			console.log('Terms Stats Report')
		}
		if (report.termsProgressVisible) {
			console.log('Terms Progress Report')
		}
		if (report.termsTimesVisible) {
			console.log('Terms Times Report')
		}
		console.log('-------------------------')
	}

	if (report.schoolWorkReportVisible) {
		console.log('School Work Report')

		if (report.schoolWorkStatsVisible) {
			console.log('School Work Stats Report')
		}
		if (report.schoolWorkProgressVisible) {
			console.log('School Work Progress Report')
		}
		if (report.schoolWorkTimesVisible) {
			console.log('School Work Times Report')
		}
		if (report.schoolWorkDescriptionVisible) {
			console.log('School Work Description Report')
		}
		if (report.schoolWorkResourcesVisible) {
			console.log('School Work Resources Report')
		}
		console.log('-------------------------')
	}

	if (report.timesPerWeekReportVisible) {
		console.log('Times Per Week Report')
		
		if (report.timesPerWeekProgressVisible) {
			console.log('Times Per Week Progress Report')
		}
		if (report.timesPerWeekCompletionDateVisible) {
			console.log('Times Per Week Completeion Date Report')
		}
		if (report.timesPerWeekCompletionTimeVisible) {
			console.log('Times Per Week Completeion Time Report')
		}
		if (report.timesPerWeekDescriptionVisible) {
			console.log('Times Per Week Description Report')
		}
		console.log('-------------------------')
	}

	if (report.termsReportVisible) {
		console.log('Terms Report')

		if (report.resourcesOriginatorVisible) {
			console.log('Resource Originator Report')
		}
		if (report.resourcesPublicationVisible) {
			console.log('Resource Publication Report')
		}
		if (report.resourcesSchoolWorkVisible) {
			console.log('Resource School Work Report')
		}
		if (report.resourcesLinkVisible) {
			console.log('Resource resourcesLinkVisible Report')
		}
		if (report.resourcesDescriptionVisible) {
			console.log('Resource Description Report')
		}
	}
	console.log('=========================')
	return false;
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
			let schoolWorkIds = SchoolWork.find({groupId: groupId, schoolYearId: schoolYearId, studentId: studentId, deletedOn: { $exists: false }}).map(schoolWork => (schoolWork._id));

			let terms = Terms.find({groupId: groupId, schoolYearId: schoolYearId, deletedOn: { $exists: false }});
			let weeks = Weeks.find({groupId: groupId, termId: {$in: termIds}, deletedOn: { $exists: false }});
			let schoolWork = SchoolWork.find({groupId: groupId, schoolYearId: schoolYearId, studentId: studentId, deletedOn: { $exists: false }});
			let lessons = Lessons.find({groupId: groupId, schoolWorkId: {$in: schoolWorkIds}, deletedOn: { $exists: false }});

			// School Year
			let lessonsTotal = lessons.count();
			let lessonsCompletedTotal = Lessons.find({completed: true, groupId: groupId, schoolWorkId: {$in: schoolWorkIds}, deletedOn: { $exists: false }}).count();
			let percentComplete = lessonsCompletedTotal / lessonsTotal * 100;

			let lessonsIncompleteTotal = Lessons.find({completed: false, groupId: groupId, schoolWorkId: {$in: schoolWorkIds}, deletedOn: { $exists: false }}).count();
			let lessonCompletionTimes = Lessons.find({completed: true, groupId: groupId, schoolWorkId: {$in: schoolWorkIds}, deletedOn: { $exists: false }}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
			
			// Average Term
			let completedWeekIds = Lessons.find({completed: true, groupId: groupId, schoolWorkId: {$in: schoolWorkIds}, deletedOn: { $exists: false }}).map(lesson => (lesson.weekId));
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
			stats.schoolWorkCount = schoolWork.count(),
			stats.weekCount = weeks.count(),
			stats.lessonCount = lessons.count(),
			stats.progress = progress(percentComplete),
			stats.progressComplete = progressStatus(lessonsIncompleteTotal),
			stats.totalTime = minutesConvert(totalTimeMinutes),
			stats.averageLessons = minutesConvert(averageLessonMinutes),
			stats.averageWeeks = minutesConvert(averageWeekMinutes),
			stats.averageTerms = minutesConvert(averageTermMinutes),

			console.log(stats)
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
				let lessonIds = _.uniq(Lessons.find({groupId: groupId, weekId: {$in: weekIds}, deletedOn: { $exists: false }}).map(lesson => (lesson.schoolWorkId)));
				let schoolWork = SchoolWork.find({_id: {$in: lessonIds}, studentId: studentId, schoolYearId: schoolYearId, groupId: groupId, deletedOn: { $exists: false }});
				let schoolWorkIds = schoolWork.map(schoolWork => (schoolWork._id));
				let lessons = Lessons.find({groupId: groupId, schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: weekIds}, deletedOn: { $exists: false }})

				stats.order = term.order;
				stats.schoolYearId = schoolYearId;
				stats.schoolWorkCount = schoolWork.count();
				stats.weekCount = weekIds.length;
				stats.lessonCount = lessons.count();

				// Term Progress
				let lessonsTotal = lessons.count();
				let lessonsCompletedTotal = Lessons.find({groupId: groupId, schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: weekIds}, completed: true, deletedOn: { $exists: false }}).count();
				let percentComplete = lessonsCompletedTotal / lessonsTotal * 100;
				if (percentComplete > 0 && percentComplete < 1) {
					stats.progress =  1;
				} else {
					stats.progress = Math.floor(percentComplete);
				}

				// Term Progress Status
				let lessonsIncompleteTotal = Lessons.find({groupId: groupId, schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: weekIds}, completed: false, deletedOn: { $exists: false }}).count();
				if (!lessonsIncompleteTotal) {
					stats.progressComplete = true;
				} else {
					stats.progressComplete = false;
				}

				// Term Total Time
				let lessonCompletionTimes = Lessons.find({groupId: groupId, schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: weekIds}, completed: true, deletedOn: { $exists: false }}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
				let totalMinutes = _.sum(lessonCompletionTimes);
				stats.totalTime = minutesConvert(totalMinutes);

				//  Terms Average Weeks
				let completedWeekIds = Lessons.find({groupId: groupId, schoolWorkId: {$in: schoolWorkIds}, weekId: {$in: weekIds}, completed: true, deletedOn: { $exists: false }}).map(lesson => (lesson.weekId));
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

Meteor.publish('reportSchoolWork', function(schoolYearId, studentId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let student = Students.findOne({_id: studentId, groupId: groupId, deletedOn: { $exists: false }});
		let schoolYear = SchoolYears.findOne({_id: schoolYearId, groupId: groupId, deletedOn: { $exists: false }});

		if (student && schoolYear) {
			let schoolWork = SchoolWork.find({groupId: groupId, schoolYearId: schoolYearId, studentId: studentId, deletedOn: { $exists: false }});

			// School Work
			schoolWork.forEach((schoolWork) => {
				let stats = {};
				let weekIds = Lessons.find({groupId: groupId, schoolWorkId: schoolWork._id, deletedOn: { $exists: false }}).map(lesson => (lesson.weekId));

				stats.order = schoolWork.order;
				stats.name = schoolWork.name;
				stats.description = schoolWork.description;
				stats.resources= schoolWork.resources;
				stats.studentId = studentId;
				stats.schoolYearId = schoolYearId;
				stats.termCount = _.uniq( Weeks.find({_id: {$in: weekIds}, groupId: groupId, deletedOn: { $exists: false }}).map(week => (week.termId)) ).length;
				stats.weekCount = _.uniq( Lessons.find({groupId: groupId, schoolWorkId: schoolWork._id, deletedOn: { $exists: false }}).map(lesson => (lesson.weekId)) ).length;
				stats.lessonCount = Lessons.find({groupId: groupId, schoolWorkId: schoolWork._id, deletedOn: { $exists: false }}).count();

				// School Work Progress
				let lessonsTotal = Lessons.find({groupId: groupId, schoolWorkId: schoolWork._id, deletedOn: { $exists: false }}).count();
				let lessonsCompletedTotal = Lessons.find({groupId: groupId, schoolWorkId: schoolWork._id, completed: true, deletedOn: { $exists: false }}).count();
				let percentComplete = lessonsCompletedTotal / lessonsTotal * 100;
				if (percentComplete > 0 && percentComplete < 1) {
					stats.progress = 1;
				} else {
					stats.progress = Math.floor(percentComplete);
				}

				// School Work Progress Status
				let lessonsIncompleteTotal = Lessons.find({groupId: groupId, schoolWorkId: schoolWork._id, completed: false, deletedOn: { $exists: false }}).count();
				if (!lessonsIncompleteTotal) {
					stats.progressComplete = true;
				} else {
					stats.progressComplete = false;
				}

				// School Work Total Time
				let lessonCompletionTimes = Lessons.find({groupId: groupId, schoolWorkId: schoolWork._id, completed: true, deletedOn: { $exists: false }}).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
				let totalMinutes = _.sum(lessonCompletionTimes);
				stats.totalTime = minutesConvert(totalMinutes);

				// School Work Average Lesssons
				let averageLessonsMinutes = _.sum(lessonCompletionTimes) / lessonCompletionTimes.length;
				stats.averageLessons = minutesConvert(averageLessonsMinutes);

				// School Work Average Weeks
				let weeksTotal = _.uniq( Lessons.find({groupId: groupId, schoolWorkId: schoolWork._id, completed: true, deletedOn: { $exists: false }}).map(lesson => (lesson.weekId)) ).length;
				let averageWeekMinutes = _.sum(lessonCompletionTimes) / weeksTotal;
				stats.averageWeeks = minutesConvert(averageWeekMinutes); 

				// School Work Average Terms
				let completedWeekIds = _.uniq( Lessons.find({groupId: groupId, schoolWorkId: schoolWork._id, completed: true, deletedOn: { $exists: false }}).map(lesson => (lesson.weekId)) );
				let termsTotal = _.uniq( Weeks.find({_id: {$in: completedWeekIds}, deletedOn: { $exists: false }}).map(week => (week.termId)) ).length;
				let averageTermMinutes = _.sum(lessonCompletionTimes) / termsTotal;
				stats.averageTerms = minutesConvert(averageTermMinutes);

				self.added('schoolWork', schoolWork._id, stats);
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
			let resourceIds = _.flatten( SchoolWork.find({groupId: groupId, schoolYearId: schoolYearId, studentId: studentId, deletedOn: { $exists: false }}).map(schoolWork => (schoolWork.resources)) );
			let resources = Resources.find({_id: {$in: resourceIds}, groupId: groupId, deletedOn: { $exists: false }});

			resources.map((rescource) => {
				self.added('resources', rescource._id, rescource);
			});
		}

		self.ready();
	});
});










