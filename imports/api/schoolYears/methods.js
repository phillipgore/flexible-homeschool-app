import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {SchoolYears} from './schoolYears.js';
import {Paths} from '../../api/paths/paths.js';
import {Stats} from '../../api/stats/stats.js';
import {SchoolWork} from '../schoolWork/schoolWork.js';
import {Terms} from '../terms/terms.js';
import {Weeks} from '../weeks/weeks.js';
import {Lessons} from '../lessons/lessons.js';
import {primaryInitialIds} from '../../modules/server/initialIds';
import {upsertPaths} from '../../modules/server/paths';

Meteor.methods({
	insertSchoolYear: function(schoolYearProperties, termProperties) {
		const schoolYearId = SchoolYears.insert(schoolYearProperties, function(error, schoolYearId) {
			if (error) { 
				throw new Meteor.Error(500, error);
			} else {
				termProperties.forEach(function(term) {
					const weeksPerTerm = term.weeksPerTerm;
					term.schoolYearId = schoolYearId;
					delete term.weeksPerTerm;

					Terms.insert(term, function(error, termId) {
						if (error) { 
							throw new Meteor.Error(500, error);
						} else {
							let weekProperties = []
							for (i = 0; i < parseInt(weeksPerTerm); i++) { 
							    weekProperties.push({order: i + 1, schoolYearId: schoolYearId, termId: termId, termOrder: term.order});
							}
							weekProperties.forEach(function(week) {
								Weeks.insert(week);
							});
						}
					});
				})
			}
		});	

		return schoolYearId;
	},

	updateSchoolYear: function(schoolYearId, schoolYearProperties) {
		SchoolYears.update(schoolYearId, {$set: schoolYearProperties});
	},

	deleteSchoolYear: function(schoolYearId) {
		let schoolWorkIds = SchoolWork.find({schoolYearId: schoolYearId}).map(schoolWork => (schoolWork._id))
		let termIds = Terms.find({schoolYearId: schoolYearId}).map(term => (term._id));
		let weekIds = Weeks.find({schoolYearId: schoolYearId}).map(week => (week._id));
		let lessonIds = Lessons.find({schoolYearId: schoolYearId}).map(lesson => (lesson._id));

		// School Year
		SchoolYears.remove({_id: schoolYearId});
		Paths.remove({timeFrameId: schoolYearId});
		Stats.remove({timeFrameId: schoolYearId});

		// School Work
		SchoolWork.remove({_id: {$in: schoolWorkIds}});

		// Terms
		Terms.remove({_id: {$in: termIds}});
		Paths.remove({timeFrameId: {$in: termIds}});
		Stats.remove({timeFrameId: {$in: termIds}});

		// Weeks
		Weeks.remove({_id: {$in: weekIds}});
		Stats.remove({timeFrameId: {$in: weekIds}});

		// Lessons
		Lessons.remove({_id: {$in: lessonIds}});
	},

	updateSchoolYearTerms: function(schoolYearId, schoolYearProperties, termDeleteIds, termInsertProperties, termUpdateProperties, userId, groupId) {
		let weekDeleteIds = Weeks.find({termId: {$in: termDeleteIds}}).map(week => week._id);

		let weekBulkDelete = [];
		let lessonBulkDelete = [];

		Weeks.find({termId: {$in: termDeleteIds}}).map(week => week._id).forEach(weekId => {
			weekBulkDelete.push({deleteOne: {"filter": {_id: weekId}}});
		})

		Lessons.find({weekId: {$in: weekDeleteIds}}).map(lesson => lesson._id).forEach(lessonId => {
			lessonBulkDelete.push({deleteOne: {"filter": {_id: lessonId}}})
		})


		let weekBulkInsertProperties = [];
		let lessonBulkUpdateProperties = [];

		termUpdateProperties.forEach(term => {
			let weeksDif = term.weeksPerTerm - term.origWeeksPerTerm;
			let currentWeekIds = Weeks.find({termId: term._id}).fetch();

			// Check to see if the new Week count is lower than the existing Week count
			if (weeksDif >= 0) {
				// Create new Week properties if any are needed
				for (i = 0; i < weeksDif; i++) {
					weekBulkInsertProperties.push({insertOne: {"document": {
						_id: Random.id(),
						schoolYearId: schoolYearId,
						termId: term._id, 
						termOrder: parseInt(term.order),
						order: term.origWeeksPerTerm + 1 + i, 
						groupId: groupId, 
						userId: userId, 
						createdOn: new Date()
					}}})
				}
			} else {
				// Get Weeks to be deleted from lower Week count in form (last weeks first)
				let weekMoreDeleteIds = Weeks.find({termId: term._id}, {limit: Math.abs(weeksDif), sort: {order: -1}}).map(week => (week._id));
				let lessonMoreDeleteIds = Lessons.find({weekId: {$in: weekMoreDeleteIds}}).map(lesson => (lesson._id))

				for (i = 0; i < weekMoreDeleteIds.length; i++) {
					weekBulkDelete.push({deleteOne: {"filter": {_id: weekMoreDeleteIds[i]}}});
				}

				for (i = 0; i < lessonMoreDeleteIds.length; i++) {
					lessonBulkDelete.push({deleteOne: {"filter": {_id: lessonMoreDeleteIds[i]}}});
				}

				SchoolWork.find().forEach((schoolWork) => {
					let lessonIds = Lessons.find({schoolWorkId: schoolWork._id, weekId: {$in: currentWeekIds.map(week => week._id)}}, {sort: {completedOn: -1, completed: -1, assigned: -1}}).map(lesson => (lesson._id));
					let lessonsPerWeek = Math.ceil(lessonIds.length / currentWeekIds.length);
					
					// Redistribute Lessons over Weeks (more per week = fewer weeks with lessons)
					currentWeekIds.forEach((week, index) => {
						let startSlice = index * lessonsPerWeek;
						let endSlice = startSlice + lessonsPerWeek;
						let lesssonSlice = lessonIds.slice(startSlice, endSlice);

						lesssonSlice.forEach((lessonId) => {
							lessonBulkUpdateProperties.push({updateOne: {"filter": {_id: lessonId}, update: {$set: {schoolYearId: schoolYearId, termId: week.termId, weekId: week._id}}}});
						});
					});
				});
			};
		});

		// Updates School Year
		SchoolYears.update(schoolYearId, {$set: schoolYearProperties});

		
		// Removes Lessons
		if (lessonBulkDelete.length) {
			Meteor.call('bulkWriteLessons', lessonBulkDelete, function(error) {
				if (error) {
					throw new Meteor.Error(500, error);
				}
			});
		}

		// Removes Weeks
		if (weekBulkDelete.length) {
			Meteor.call('bulkWriteWeeks', weekBulkDelete, function(error) {
				if (error) {
					throw new Meteor.Error(500, error);
				}
			});
		}

		// Removes Terms
		if (termDeleteIds.length) {
			Meteor.call('batchRemoveTerms', termDeleteIds, function(error) {
				if (error) {
					throw new Meteor.Error(500, error);
				}
			});
		}

		// Updates Terms
		if (termUpdateProperties.length) {
			Meteor.call('batchUpdateTerms', termUpdateProperties, function(error) {
				if (error) {
					throw new Meteor.Error(500, error);
				}
			});
		}

		// Updates Lessons
		if (lessonBulkUpdateProperties.length) {
			Meteor.call('bulkWriteLessons', lessonBulkUpdateProperties, function(error) {
				if (error) {
					throw new Meteor.Error(500, error);
				}
			});
		}

		// Inserts Weeks
		if (weekBulkInsertProperties.length) {
			Meteor.call('bulkWriteWeeks', weekBulkInsertProperties, function(error) {
				if (error) {
					throw new Meteor.Error(500, error);
				}
			});
		}

		// Inserts Terms
		if (termInsertProperties.length) {
			termInsertProperties.forEach(function(term) {
				const weeksPerTerm = term.weeksPerTerm;
				const termOrder = parseInt(term.order);
				delete term.weeksPerTerm;

				Meteor.call('insertTerm', term, function(error, termId) {
					if (error) {
						if (error) {
							throw new Meteor.Error(500, error);
						}
					} else {
						let newWeekBulkInsertProperties = []							
						for (i = 0; i < parseInt(weeksPerTerm); i++) { 
						    newWeekBulkInsertProperties.push({insertOne: {"document": {
						    	_id: Random.id(),
						    	order: i + 1, 
						    	termId: termId, 
						    	termOrder: termOrder,
						    	groupId: groupId, 
						    	userId: userId, 
						    	createdOn: new Date()
						    }}});
						}

						// Inserts Weeks
						Meteor.call('bulkWriteWeeks', newWeekBulkInsertProperties, function(error) {
							if (error) {
								throw new Meteor.Error(500, error);
							}
						});
					}
				});
			});
		};

		return true;
	},
})