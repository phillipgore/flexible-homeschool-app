import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {SchoolYears} from './schoolYears.js';
import {Paths} from '../../api/paths/paths.js';
import {Stats} from '../../api/stats/stats.js';
import {SchoolWork} from '../schoolWork/schoolWork.js';
import {Terms} from '../terms/terms.js';
import {Weeks} from '../weeks/weeks.js';
import {Lessons} from '../lessons/lessons.js';

import _ from 'lodash'

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

	updateSchoolYearTerms: function(schoolYearId, schoolYearProperties, termDeleteIds, weekDeleteIds, termUpdateProperties, weekUpdateProperties, termInsertProperties, weekInsertProperties, userId, groupId) {
		let yearLessons = Lessons.find({schoolYearId: schoolYearId}, {fields: {weekId: 1, termId: 1}}).fetch();

		let termBulkDelete = [];
		let weekBulkDelete = [];
		let lessonBulkDelete = [];

		let termBulkUpdate = [];
		let weekBulkUpdate = [];
		let lessonBulkUpdate = [];

		let termBulkInsert = [];
		let weekBulkInsert = [];


		// Delete Terms, Weeks & Lessons
		termDeleteIds.forEach(termId => {
			termBulkDelete.push({deleteOne: {"filter": {_id: termId}}});
		});

		weekDeleteIds.forEach(weekId => {
			weekBulkDelete.push({deleteOne: {"filter": {_id: weekId}}});
		});

		_.filter(yearLessons, lesson => _.includes(weekDeleteIds, lesson.weekId)).forEach(lesson => {
			lessonBulkDelete.push({deleteOne: {"filter": {_id: lesson._id}}})
		});

		termUpdateProperties.forEach(term => {
			termBulkUpdate.push({updateOne: {"filter": {_id: term._id}, update: {$set: {order: term.order}}}});
			_.filter(yearLessons, ['termId', term._id]).forEach(lesson => {
				lessonBulkUpdate.push({updateOne: {"filter": {_id: lesson._id}, update: {$set: {termOrder: term.order}}}});
			});
		});

		weekUpdateProperties.forEach(week => {
			weekBulkUpdate.push({updateOne: {"filter": {_id: week._id}, update: {$set: {order: week.order}}}});
			_.filter(yearLessons, ['weekId', week._id]).forEach(lesson => {
				lessonBulkUpdate.push({updateOne: {"filter": {_id: lesson._id}, update: {$set: {weekOrder: week.order}}}});
			});
		});	

		weekInsertProperties.forEach(week => {
			weekBulkInsert.push({insertOne: {"document": {
				_id: Random.id(),
				order: week.order,
				termOrder: week.termOrder,
				schoolYearId: schoolYearId,
				termId: week.termId,
				groupId: groupId,
				userId: userId,
				createdOn: new Date()
			}}})
		})
		
		termInsertProperties.forEach(term => {
			let termId = Random.id();
			termBulkInsert.push({insertOne: {"document": {
				_id: termId,
				order: term.order,
				schoolYearId: schoolYearId,
				groupId: groupId,
				userId: userId,
				createdOn: new Date()
			}}})

			for (i = 0; i < parseInt(term.weeksPerTerm); i++) {
				weekBulkInsert.push({insertOne: {"document": {
					_id: Random.id(),
					order: i + 1,
					termOrder: term.order,
					schoolYearId: schoolYearId,
					termId: termId,
					groupId: groupId,
					userId: userId,
					createdOn: new Date()
				}}})
			}
		})

		
		let termsBulk = termBulkDelete.concat(termBulkUpdate, termBulkInsert);
		let weeksBulk = weekBulkDelete.concat(weekBulkUpdate, weekBulkInsert);
		let lessonsBulk = lessonBulkDelete.concat(lessonBulkUpdate);

		if (termsBulk.length) {
			Terms.rawCollection().bulkWrite(
				termsBulk
			).catch((error) => {
				throw new Meteor.Error(500, error.message);
			});
		}

		if (weeksBulk.length) {
			Weeks.rawCollection().bulkWrite(
				weeksBulk
			).catch((error) => {
				throw new Meteor.Error(500, error.message);
			});
		}
		
		if (lessonsBulk.length) {	
			Lessons.rawCollection().bulkWrite(
				lessonsBulk
			).catch((error) => {
				throw new Meteor.Error(500, error.message);
			});
		}

		return true;
	},
})