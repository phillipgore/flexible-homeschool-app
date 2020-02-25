import {Reports} from '../reports.js';
import {Students} from '../../students/students.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Terms} from '../../terms/terms.js';
import {Weeks} from '../../weeks/weeks.js';
import {SchoolWork} from '../../schoolWork/schoolWork.js';
import {Notes} from '../../notes/notes.js';
import {Resources} from '../../resources/resources.js';
import {Lessons} from '../../lessons/lessons.js';

import {minutesConvert} from '../../../modules/server/functions';
import _ from 'lodash';
import moment from 'moment';

Meteor.publish('allReports', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Reports.find({groupId: groupId}, {fields: {name: 1}});
});

Meteor.publish('report', function(reportId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Reports.find({_id: reportId, groupId: groupId});
});

Meteor.publish('reportData', function(studentId, schoolYearId, termId, weekId, reportId) {
	// this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let parameters = [studentId, schoolYearId, termId, weekId, reportId]

		if (!_.includes(parameters, 'empty')) {
			let report = Reports.findOne({_id: reportId, groupId: groupId});
			self.added('reports', report._id, report);

			function getReportTerms(termId) {
				if (termId === 'allTerms') {
					return Terms.find({groupId: groupId, schoolYearId: schoolYearId}).fetch();
				} else {
					return Terms.find({_id: termId}).fetch();
				}
			}

			let reportTerms = getReportTerms(termId);

			function getReportWeeks(weekId) {
				if (weekId === 'allWeeks') {
					return Weeks.find({groupId: groupId, termId: {$in: reportTerms.map(term => term._id)}}).fetch();
				} else {
					return Weeks.find({_id: weekId}).fetch();
				}
			}

			let reportWeeks = getReportWeeks(weekId);

			function percentComplete(completedTotal, total) {
				if (!completedTotal || !total) {
					return 0;
				} else {
					return completedTotal / total * 100;
				}
			}



			// School Year Data
			let yearSchoolYear = SchoolYears.find({_id: schoolYearId, groupId: groupId}).fetch();
			let yearTerms = Terms.find({schoolYearId: schoolYearId}).fetch();
			let yearWeeks = Weeks.find({termId: {$in: yearTerms.map(term => term._id)}}).fetch();
			let yearSchoolWork = SchoolWork.find({groupId: groupId, schoolYearId: schoolYearId, studentId: studentId}, {sort: {name: 1}}).fetch();
			let yearNotes = Notes.find({groupId: groupId, schoolWorkId: {$in: yearSchoolWork.map(work => work._id)}}).fetch();
			let yearLessons = Lessons.find({groupId: groupId, schoolWorkId: {$in: yearSchoolWork.map(schoolWork => schoolWork._id)}}, {sort: {order: 1}}).fetch();
			let yearResources = Resources.find(
				{
					_id: {$in: _.flatten(yearSchoolWork.map(schoolWork => schoolWork.resources))}, 
					groupId: groupId
				}, 
				{
					sort: {title: 1}, 
					fields: {type: 1, title: 1, availability: 1, link: 1}
				}
			).fetch();

			let yearLessonCompletionTimes = _.filter(yearLessons, ['completed', true]).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
			let yearLessonsCompletedTotal = _.filter(yearLessons, ['completed', true]).length;

			if (report.schoolYearReportVisible) {
				let schoolYearStats = {};

				schoolYearStats.schoolYearId = yearSchoolYear._id;

				let yearLessonsTotal = yearLessons.length;
				let yearLessonsCompletedTotal = _.filter(yearLessons, ['completed', true]).length;
				let yearPercentComplete = percentComplete(yearLessonsCompletedTotal, yearLessonsTotal);
				let yearLessonsIncompletedTotal = _.filter(yearLessons, ['completed', false]).length;

				if (report.schoolYearStatsVisible) {
					schoolYearStats.termCount = yearTerms.length;
					schoolYearStats.schoolWorkCount = yearSchoolWork.length;
					schoolYearStats.weekCount = yearWeeks.length;
					schoolYearStats.lessonCount = yearLessons.length;
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

					schoolYearStats.progress = progress(yearPercentComplete);
					schoolYearStats.progressComplete = progressStatus(yearLessonsIncompletedTotal);
				}

				if (report.schoolYearTimesVisible) {
					let yearCompletedWeekIds = _.uniq(_.filter(yearLessons, ['completed', true]).map(lesson => (lesson.weekId)));
					let yearCompletedTermIds = Weeks.find({_id: {$in: yearCompletedWeekIds}}).map(week => (week.termId));
					let yearTermsTotal = Terms.find({_id: {$in: yearCompletedTermIds}}).count();			
					let yearWeeksTotal = yearCompletedWeekIds.length;

					let yearTotalTimeMinutes = _.sum(yearLessonCompletionTimes);
					let yearAverageTermMinutes = _.sum(yearLessonCompletionTimes) / yearTermsTotal;
					let yearAverageWeekMinutes = _.sum(yearLessonCompletionTimes) / yearWeeksTotal;
					let yearAverageLessonMinutes = _.sum(yearLessonCompletionTimes) / yearLessonsCompletedTotal;

					schoolYearStats.totalTime = minutesConvert(yearTotalTimeMinutes);
					schoolYearStats.averageLessons = minutesConvert(yearAverageLessonMinutes);
					schoolYearStats.averageWeeks = minutesConvert(yearAverageWeekMinutes);
					schoolYearStats.averageTerms = minutesConvert(yearAverageTermMinutes);
				}

				self.added('schoolYears', schoolYearId, schoolYearStats);
			}




			// Term & School Work Data
			let termsStats = [];
			if (report.termsReportVisible) {
				reportTerms.forEach((term) => {
					let termData = {};

					let termWeekIds = _.filter(yearWeeks, ['termId', term._id]).map(week => (week._id));
					let termSchoolWorkIds = _.uniq(_.filter(yearLessons, lesson => _.includes(termWeekIds, lesson.weekId)).map(lesson => lesson.schoolWorkId));
					let termSchoolWork = _.filter(yearSchoolWork, schoolWork => _.includes(termSchoolWorkIds, schoolWork._id));
					let termLessons = _.filter(yearLessons, lesson => _.includes(termWeekIds, lesson.weekId));
					let termLessonsTotal = termLessons.length;

					termData._id = term._id;
					termData.order = term.order;
					termData.schoolYearId = schoolYearId;

					if (report.termsStatsVisible) {
						termData.schoolWorkCount = termSchoolWork.length;
						termData.weekCount = termWeekIds.length;
						termData.lessonCount = termLessonsTotal;
					}

					if (report.termsProgressVisible) {
						// Term Progress
						let lessonsCompletedTotal = _.filter(termLessons, ['completed', true]).length;
						let termPercentComplete = percentComplete(lessonsCompletedTotal, termLessonsTotal);
						
						if (termPercentComplete > 0 && termPercentComplete < 1) {
							termData.progress =  1;
						} else {
							termData.progress = Math.floor(termPercentComplete);
						}

						// Term Progress Status
						let lessonsIncompleteTotal = _.filter(termLessons, ['completed', false]).length;
						if (!lessonsIncompleteTotal) {
							termData.progressComplete = true;
						} else {
							termData.progressComplete = false;
						}
					}
					
					if (report.termsTimesVisible) {
						// Term Total Time
						let lessonCompletionTimes = _.filter(termLessons, ['completed', true]).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
						let totalMinutes = _.sum(lessonCompletionTimes);

						termData.totalTime = minutesConvert(totalMinutes);

						//  Terms Average Weeks
						let completedWeekIds = _.uniq(_.filter(termLessons, ['completed', true]).map(lesson => (lesson.weekId)));
						let weeksTotal = completedWeekIds.length;
						let averageWeekMinutes = _.sum(lessonCompletionTimes) / weeksTotal;
						termData.averageWeeks = minutesConvert(averageWeekMinutes);

						//  Terms Average Lessons
						let averageLessonMinutes = _.sum(lessonCompletionTimes) / lessonCompletionTimes.length;
						termData.averageLessons = minutesConvert(averageLessonMinutes);

					}

					termsStats.push(termData);
				});
			}
			termsStats.forEach(term => {
				self.added('terms', term._id, term);
			})




			// School Work Data
			let schoolWorkStats = [];
			if (report.schoolWorkReportVisible) {
				let weekIds = reportWeeks.map(week => week._id);
				let lessons = _.filter(yearLessons, lesson => _.includes(weekIds, lesson.weekId));
				let schoolWork = _.filter(yearSchoolWork, schoolWork => _.includes(lessons.map(lesson => lesson.schoolWorkId), schoolWork._id));

				schoolWork.forEach((schoolWork) => {
					let schoolWorkData = {};

					let schoolWorkLessons = _.filter(lessons, ['schoolWorkId', schoolWork._id])
					let schoolWorkWeeks = _.filter(reportWeeks, week => _.includes(schoolWorkLessons.map(lesson => lesson.weekId), week._id))
					let schoolWorkTerms = _.filter(reportTerms, term => _.includes(schoolWorkWeeks.map(week => week.termId), term._id))

					schoolWorkData._id = schoolWork._id;
					schoolWorkData.weekData = [];
					schoolWorkData.order = schoolWork.order;
					schoolWorkData.name = schoolWork.name;
					schoolWorkData.studentId = studentId;
					schoolWorkData.schoolYearId = schoolYearId;

					if (report.schoolWorkDescriptionVisible) {
						schoolWorkData.description = schoolWork.description;
					}

					if (report.schoolWorkResourcesVisible) {
						let schoolWorkResources = _.filter(yearResources, resource => _.includes(schoolWork.resources, resource._id));
						schoolWorkData.resources = schoolWorkResources;
					}

					if (report.schoolWorkStatsVisible) {
						schoolWorkData.termCount = schoolWorkTerms.length;
						schoolWorkData.weekCount = schoolWorkWeeks.length;
						schoolWorkData.lessonCount = schoolWorkLessons.length;
					}

					if (report.schoolWorkProgressVisible) {
						// School Work Year Progress
						let lessonsTotal = schoolWorkLessons.length;
						let lessonsCompletedTotal = _.filter(schoolWorkLessons, ['completed', true]).length;
						let schoolWorkPercentComplete = percentComplete(lessonsCompletedTotal, lessonsTotal);
						if (schoolWorkPercentComplete > 0 && schoolWorkPercentComplete < 1) {
							schoolWorkData.progress = 1;
						} else {
							schoolWorkData.progress = Math.floor(schoolWorkPercentComplete);
						}

						// School Work Year Progress Status
						let lessonsIncompleteTotal = _.filter(schoolWorkLessons, ['completed', false]).length;
						if (!lessonsIncompleteTotal) {
							schoolWorkData.progressComplete = true;
						} else {
							schoolWorkData.progressComplete = false;
						}
					}

					if (report.schoolWorkTimesVisible) {
						// School Work Year Total Time
						let lessonCompletionTimes = _.filter(schoolWorkLessons, ['completed', true]).map(lesson => (lesson.completionTime)).filter(time => (time != undefined));
						let totalMinutes = _.sum(lessonCompletionTimes);
						schoolWorkData.totalTime = minutesConvert(totalMinutes);

						// School Work Year Average Lesssons
						let averageLessonsMinutes = _.sum(lessonCompletionTimes) / lessonCompletionTimes.length;
						schoolWorkData.averageLessons = minutesConvert(averageLessonsMinutes);

						// School Work Year Average Weeks
						let weeksTotal = _.uniq( _.filter(schoolWorkLessons, ['completed', true]).map(lesson => (lesson.weekId)) ).length;
						let averageWeekMinutes = _.sum(lessonCompletionTimes) / weeksTotal;
						schoolWorkData.averageWeeks = minutesConvert(averageWeekMinutes); 

						// School Work Year Average Terms
						let completedWeekIds = _.uniq( _.filter(schoolWorkLessons, ['completed', true]).map(lesson => (lesson.weekId)) );
						let termsTotal = _.uniq( _.filter(schoolWorkWeeks, week => _.includes(completedWeekIds, week._id)).map(week => week.termId) ).length;
						let averageTermMinutes = _.sum(lessonCompletionTimes) / termsTotal;
						schoolWorkData.averageTerms = minutesConvert(averageTermMinutes);
					}

					schoolWorkStats.push(schoolWorkData)
				});
			}
			schoolWorkStats.forEach(schoolWork => {
				self.added('schoolWork', schoolWork._id, schoolWork);
			});



			// Week Data
			let weekStats = [];
			reportWeeks.forEach(week => {
				weekData = {};

				weekData._id = week._id;
				weekData.order = week.order;
				weekData.termId = week.termId;

				if (report.timesPerWeekReportVisible) {
					// let notes = {}
					// yearNotes.filter(note => note.weekId === week._id).forEach(note => {
					// 	notes.push(note);
					// })
					// weekData.note = notes;
					weekData.noteData = yearNotes.filter(note => note.weekId === week._id);
					console.log(yearNotes.filter(note => note.weekId === week._id))

					let lessonStats = [];
					let lessons = _.filter(yearLessons, ['weekId', week._id]);

					lessons.forEach(lesson => {
						let lessonData = {};

						lessonData._id = lesson._id;
						lessonData.order = lesson.order;
						lessonData.weekDay = parseInt(lesson.weekDay);
						lessonData.schoolWorkId = lesson.schoolWorkId;
						lessonData.completed = lesson.completed;
						if (lesson.completedOn) {
							lessonData.completedOn = lesson.completedOn.toDateString();
						}
						lessonData.completionTime = lesson.completionTime;
						lessonData.description = lesson.description;

						lessonStats.push(lessonData);
					});
					weekData.lessonData = lessonStats;
				}

				weekStats.push(weekData)
			});
			weekStats.forEach(week => {
				self.added('weeks', week._id, week);
			});



			// Resources Data
			if (report.resourcesReportVisible) {
				let weekIds = reportWeeks.map(week => week._id);
				let lessons = _.filter(yearLessons, lesson => _.includes(weekIds, lesson.weekId));
				let schoolWork = _.filter(yearSchoolWork, schoolWork => _.includes(lessons.map(lesson => lesson.schoolWorkId), schoolWork._id))
				let resourceIds = _.uniq(_.flattenDeep(schoolWork.map(work => work.resources)));
				let resources = Resources.find({_id: {$in: resourceIds}, groupId: groupId}, {sort: {title: 1}});

				let resourceStats = [];
				resources.forEach(resource => {
					let resourceData = {};

					resourceData._id = resource._id;
					resourceData.type = resource.type;
					resourceData.title = resource.title;

					if (report.resourcesOriginatorVisible) {
						resourceData.authorFirstName = resource.authorFirstName;
						resourceData.authorLastName = resource.authorLastName;
						resourceData.directorFirstName = resource.directorFirstName;
						resourceData.directorLastName = resource.directorLastName;
						resourceData.artistFirstName = resource.artistFirstName;
						resourceData.artistLastName = resource.artistLastName;
					}
					if (report.resourcesPublicationVisible) {
						resourceData.publisher = resource.publisher;
						resourceData.publicationDate = resource.publicationDate;
					}
					if (report.resourcesSchoolWorkVisible) {
						let resouceSchoolWorkData = []
						let resourceSchoolWork = SchoolWork.find({_id: {$in: schoolWork.map(work => work._id)}, resources: resource._id});
						resourceSchoolWork.forEach(work => {
							resouceSchoolWorkData.push(work.name);
						})
						resourceData.schoolWork = resouceSchoolWorkData;
					}
					if (report.resourcesLinkVisible) {
						resourceData.link = resource.link;
					}
					if (report.resourcesDescriptionVisible) {
						resourceData.description = resource.description;
					}

					resourceStats.push(resourceData);
				});

				resourceStats.map((rescource) => {
					self.added('resources', rescource._id, rescource);
				});
			}
		}	

		self.ready();
	// });
});










