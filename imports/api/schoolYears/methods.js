import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {SchoolYears} from './schoolYears.js';
import {SchoolWork} from '../schoolWork/schoolWork.js';
import {Terms} from '../terms/terms.js';
import {Weeks} from '../weeks/weeks.js';
import {Lessons} from '../lessons/lessons.js';

Meteor.methods({
	insertSchoolYear(schoolYearProperties) {
		const schoolYearId = SchoolYears.insert(schoolYearProperties);
		return schoolYearId;
	},

	updateSchoolYear: function(schoolYearId, schoolYearProperties) {
		SchoolYears.update(schoolYearId, {$set: schoolYearProperties});
	},

	deleteSchoolYear: function(schoolYearId) {
		let schoolWorkIds = SchoolWork.find({schoolYearId: schoolYearId}).map(schoolWork => (schoolWork._id))
		let termIds = Terms.find({schoolYearId: schoolYearId}).map(term => (term._id));
		let weekIds = Weeks.find({termId: {$in: termIds}}).map(week => (week._id));
		let lessonIds = Lessons.find({weekId: {$in: weekIds}}).map(lesson => (lesson._id));

		SchoolYears.update(schoolYearId, {$set: {deletedOn: new Date()}});
		schoolWorkIds.forEach(function(schoolWorkId) {
			SchoolWork.update(schoolWorkId, {$set: {deletedOn: new Date()}});
		});
		termIds.forEach(function(termId) {
			Terms.update(termId, {$set: {deletedOn: new Date()}});
		});
		weekIds.forEach(function(weekId) {
			Weeks.update(weekId, {$set: {deletedOn: new Date()}});
		});
		lessonIds.forEach(function(lessonId) {
			Lessons.update(lessonId, {$set: {deletedOn: new Date()}});
		});
	},



	updateSchoolYearTerms: function(schoolYearId, schoolYearProperties, termDeleteIds, termInsertProperties, termUpdateProperties) {

		let weekDeleteIds = Weeks.find({termId: {$in: termDeleteIds}}).map(week => week._id);
		let lessonDeleteIds = Lessons.find({weekId: {$in: weekDeleteIds}}).map(lesson => lesson._id);
		let weekInsertProperties = [];
		let lessonUpdateProperties = [];

		termUpdateProperties.forEach(term => {
			let weeksDif = term.weeksPerTerm - term.origWeeksPerTerm;
			let currentWeekIds = Weeks.find({termId: term._id}).map(week => week._id);

			// Check to see if the new Week count is lower than the existing Week count
			if (weeksDif >= 0) {
				// Create new Week properties if any are needed
				for (i = 0; i < weeksDif; i++) {
					weekInsertProperties.push({
						termId: term._id, 
						order: term.origWeeksPerTerm + 1 + i,
					})
				}
			} else {
				// Get Weeks to be deleted from lower Week count in form (last weeks first)
				let weekMoreDeleteIds = Weeks.find({termId: term._id}, {limit: Math.abs(weeksDif), sort: {order: -1}}).map(week => (week._id));
				for (i = 0; i < weekMoreDeleteIds.length; i++) {
					weekDeleteIds.push(weekMoreDeleteIds[i]);
				}

				SchoolWork.find().forEach((schoolWork) => {
					let lessonIds = Lessons.find({schoolWorkId: schoolWork._id, weekId: {$in: currentWeekIds}}, {sort: {completedOn: -1, completed: -1, assigned: -1}}).map(lesson => (lesson._id));
					let lessonsPerWeek = Math.ceil(lessonIds.length / currentWeekIds.length);
					
					// Redistribute Lessons over Weeks (more per week = fewer weeks with lessons)
					currentWeekIds.forEach((weekId, index) => {
						let startSlice = index * lessonsPerWeek;
						let endSlice = startSlice + lessonsPerWeek;
						let lesssonSlice = lessonIds.slice(startSlice, endSlice);

						lesssonSlice.forEach((lessonId) => {
							lessonUpdateProperties.push({_id: lessonId, weekId: weekId});
						});
					});
				});
			};
		});

		// Updates School Year
		SchoolYears.update(schoolYearId, {$set: schoolYearProperties});

		
		// Removes Lessons
		if (lessonDeleteIds.length) {
			Meteor.call('batchRemoveLessons', lessonDeleteIds, function(error) {
				if (error) {
					throw new Meteor.Error(500, error);
				}
				console.log('lessons removed')
			});
		}

		// Removes Weeks
		if (weekDeleteIds.length) {
			Meteor.call('batchRemoveWeeks', weekDeleteIds, function(error) {
				if (error) {
					throw new Meteor.Error(500, error);
				}
				console.log('weeks removed')
			});
		}

		// Removes Terms
		if (termDeleteIds.length) {
			Meteor.call('batchRemoveTerms', termDeleteIds, function(error) {
				if (error) {
					throw new Meteor.Error(500, error);
				}
				console.log('terms removed')
			});
		}

		// Updates Terms
		if (termUpdateProperties.length) {
			Meteor.call('batchUpdateTerms', termUpdateProperties, function(error) {
				if (error) {
					throw new Meteor.Error(500, error);
				}
				console.log('terms updated')
			});
		}

		// Updates Lessons
		if (lessonUpdateProperties.length) {
			Meteor.call('batchUpdateLessons', lessonUpdateProperties, function(error) {
				if (error) {
					throw new Meteor.Error(500, error);
				}
				console.log('lessons updated')
			});
		}

		// Inserts Weeks
		if (weekInsertProperties.length) {
			Meteor.call('batchInsertWeeks', weekInsertProperties, function(error) {
				if (error) {
					throw new Meteor.Error(500, error);
				}
				console.log('weeks inserted')
			});
		}

		// Inserts Terms
		if (termInsertProperties.length) {
			termInsertProperties.forEach(function(term) {
				const weeksPerTerm = term.weeksPerTerm;
				delete term.weeksPerTerm;

				Meteor.call('insertTerm', term, function(error, termId) {
					if (error) {
						if (error) {
							throw new Meteor.Error(500, error);
						}
						console.log('term ' +termId+ ' inserted')
					} else {
						let newWeekInsertProperties = []							
						for (i = 0; i < parseInt(weeksPerTerm); i++) { 
						    newWeekInsertProperties.push({order: i + 1, termId: termId});
						}

						// Inserts Weeks
						Meteor.call('batchInsertWeeks', newWeekInsertProperties, function(error) {
							if (error) {
								throw new Meteor.Error(500, error);
							}
							console.log('new week inserted')
						});
					}
				});
			});
		};

		console.log('/---------------------/')
		return true;
	},
})