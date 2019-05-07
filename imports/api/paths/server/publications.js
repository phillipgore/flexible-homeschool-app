import {Stats} from '../../stats/stats.js';
import {Paths} from '../../paths/paths.js';
import {Students} from '../../students/students.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Terms} from '../../terms/terms.js';
import {Weeks} from '../../weeks/weeks.js';

import _ from 'lodash'
		
function getStatus(status) {
	if (_.includes(status, 'partial')) {
		return'partial';
	}
	if (_.includes(status, 'completed') && !_.includes(status, 'empty') && !_.includes(status, 'pending')) {
		return 'completed';
	}
	if (_.includes(status, 'empty') && !_.includes(status, 'completed') && !_.includes(status, 'pending')) {
		return 'empty';
	}
	if (_.includes(status, 'pending') && !_.includes(status, 'empty') && !_.includes(status, 'completed')) {
		return 'pending';
	}
}

Meteor.publish('studentPaths', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Students.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}, fields: {birthday: 1, lastName: 1, 'preferredFirstName.type': 1, 'preferredFirstName.name': 1}});
});

Meteor.publish('schoolYearPaths', function(studentId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;

		let stats = Stats.find({groupId: groupId, studentId: studentId, type: 'schoolYear'}, {fields: {studentId: 1, timeFrameId: 1, status: 1}}).fetch();
		let paths = Paths.find({groupId: groupId, studentId: studentId, type: 'schoolYear'}, {fields: {groupId: 0, createdOn: 0, updatedOn: 0}}).fetch();
		let schoolYears = SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}, fields: {startYear: 1, endYear: 1}});
		
		schoolYears.map((schoolYear) => {
			let stat = _.find(stats,  {'timeFrameId': schoolYear._id});
			let path = _.find(paths, {'timeFrameId': schoolYear._id});

			schoolYear.firstTermId = path.firstTermId;
			schoolYear.firstWeekId = path.firstWeekId;
			schoolYear.status = stat.status;

			self.added('schoolYears', schoolYear._id, schoolYear);
		});

		self.ready();
	});
});

Meteor.publish('termPaths', function(studentId, schoolYearId, showAll) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;

		let stats = Stats.find({groupId: groupId, studentId: studentId, type: 'term'}, {fields: {studentId: 1, timeFrameId: 1, status: 1}}).fetch();
		let paths = Paths.find({groupId: groupId, studentId: studentId, type: 'term'}, {fields: {groupId: 0, createdOn: 0, updatedOn: 0}}).fetch();
		let terms = Terms.find({schoolYearId: schoolYearId, groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, schoolYearId: 1}})
		
		terms.map((term) => {
			let stat = _.find(stats,  {'timeFrameId': term._id});
			let path = _.find(paths, {'timeFrameId': term._id});

			term.firstWeekId = path.firstWeekId;
			term.status = stat.status;

			self.added('terms', term._id, term);
		});

		if (showAll && terms.count()) {
			let termStatus = stats.map(stat => stat.status);
			let allTerms = {order: 0, schoolYearId: schoolYearId, status: getStatus(termStatus), firstWeekId: 'allWeeks'}
			self.added('terms', 'allTerms', allTerms);
		}

		self.ready();
	});
});

Meteor.publish('weekPaths', function(studentId, termId, showAll) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;

		let stats = Stats.find({groupId: groupId, studentId: studentId, type: 'week'}, {fields: {studentId: 1, timeFrameId: 1, status: 1}}).fetch();
		let paths = Paths.find({groupId: groupId, studentId: studentId, type: 'week'}, {fields: {groupId: 0, createdOn: 0, updatedOn: 0}}).fetch();
		let weeks = Weeks.find({termId: termId, groupId: groupId, deletedOn: { $exists: false }}, {sort: {termOrder: 1, order: 1}, fields: {groupId: 0, userId: 0, createdOn: 0, deletedOn: 0}})

		weeks.map((week) => {
			let stat = _.find(stats,  {'timeFrameId': week._id});

			week.status = stat.status;

			self.added('weeks', week._id, week);
		});

		if (showAll && weeks.count()) {
			let weekStatus = stats.map(stat => stat.status);
			let allWeeks = {order: 0, termId: termId, status: getStatus(weekStatus)}
			self.added('weeks', 'allWeeks', allWeeks);
		}

		self.ready();
	});
});




