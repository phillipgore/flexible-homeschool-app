import {Terms} from '../terms.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';

Meteor.publish('allTerms', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Terms.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, schoolYearId: 1}});
});

Meteor.publish('firstTerms', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	let schoolYearIds = SchoolYears.find().map(schoolYear => (schoolYear._id));
	let termIds = []

	schoolYearIds.forEach(function(schoolYearId) {
		termIds.push(Terms.findOne({groupId: groupId, deletedOn: { $exists: false }, schoolYearId: schoolYearId}, {sort: {order: 1}})._id)
	})

	return Terms.find({_id: {$in: termIds}, groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, schoolYearId: 1}});
});

Meteor.publish('schoolYearsTerms', function(schoolYearId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Terms.find({groupId: groupId, deletedOn: { $exists: false }, schoolYearId: schoolYearId}, {sort: {order: 1}});
});