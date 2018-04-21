import {Terms} from '../terms.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Weeks} from '../../weeks/weeks.js';
import {Lessons} from '../../lessons/lessons.js';
import {allTermStatusAndPaths} from '../../../modules/server/functions';
import {studentTermStatusAndPaths} from '../../../modules/server/functions';

Meteor.publish('allTerms', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Terms.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, schoolYearId: 1}});
});

Meteor.publish('allTermsPath', function(schoolYearId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		SchoolYears.find();
		Weeks.find();
		Lessons.find();

		let self = this;

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let terms = Terms.find({schoolYearId: schoolYearId, groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, schoolYearId: 1}});

		terms.map((term) => {
			term = allTermStatusAndPaths(term, term._id, schoolYearId);
			self.added('terms', term._id, term);
		});

		self.ready();
	});
});

Meteor.publish('studentTermsPath', function(schoolYearId, studentId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		SchoolYears.find();
		Weeks.find();
		Lessons.find();

		let self = this;

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let terms = Terms.find({schoolYearId: schoolYearId, groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, schoolYearId: 1}});

		terms.map((term) => {
			term = studentTermStatusAndPaths(term, term._id, schoolYearId, studentId);
			self.added('terms', term._id, term);
		});

		self.ready();
	});
});

// Meteor.publish('firstTerms', function() {
// 	if (!this.userId) {
// 		return this.ready();
// 	}

// 	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
// 	let schoolYearIds = SchoolYears.find().map(schoolYear => (schoolYear._id));
// 	let termIds = []

// 	schoolYearIds.forEach(function(schoolYearId) {
// 		termIds.push(Terms.findOne({groupId: groupId, deletedOn: { $exists: false }, schoolYearId: schoolYearId}, {sort: {order: 1}})._id)
// 	})

// 	return Terms.find({_id: {$in: termIds}, groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, schoolYearId: 1}});
// });