import {SchoolYears} from '../schoolYears.js';
import {Stats} from '../../stats/stats.js';
import {Students} from '../../students/students.js';
import {Terms} from '../../terms/terms.js';
import {Weeks} from '../../weeks/weeks.js';
import {SchoolWork} from '../../schoolWork/schoolWork.js';
import {Resources} from '../../resources/resources.js';
import {Lessons} from '../../lessons/lessons.js';

import _ from 'lodash'

Meteor.publish('allSchoolYears', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}, fields: {startYear: 1, endYear: 1}});
});

Meteor.publish('schoolYearView', function(schoolYearId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let schoolYear = SchoolYears.findOne({groupId: groupId, deletedOn: { $exists: false }, _id: schoolYearId}, {fields: {startYear: 1, endYear: 1}});
		let terms = Terms.find({groupId: groupId, deletedOn: { $exists: false }, schoolYearId: schoolYearId});

		termStats = []

		terms.forEach((term) => {
			let weekCount = Weeks.find({groupId: groupId, deletedOn: { $exists: false }, termId: term._id}).count();
			if (!_.find(termStats, { 'termOrder': term.order, 'weekCount': weekCount })) {
				termStats.push({termOrder: term.order, weekCount: weekCount})
			}	
		})

		if (schoolYear) {
			schoolYear.termStats = _.uniq(termStats);
			self.added('schoolYears', schoolYear._id, schoolYear);
		}

		self.ready();
	});
});

Meteor.publish('schoolYearEdit', function(schoolYearId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;

	let terms = Terms.find({groupId: groupId, schoolYearId: schoolYearId}, {sort: {order: 1}, fields: {order: 1, schoolYearId: 1}});
	let termIds = terms.map(term => term._id);
	let weeks = Weeks.find({groupId: groupId, deletedOn: { $exists: false }, termId: {$in: termIds}});
	let weekIds = weeks.map(week => week._id)
	let timeFrameIds = termIds.concat(weekIds)
	let stats = Stats.find({timeFrameId: {$in: timeFrameIds}}, {fields: {timeFrameId: 1, status: 1}});

	return [terms, weeks, stats]
});









