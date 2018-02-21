import {SchoolYears} from '../schoolYears.js';
import {Terms} from '../../terms/terms.js';
import {Weeks} from '../../weeks/weeks.js';

Meteor.publish('allSchoolYears', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}});
});

Meteor.publish('schoolYear', function(schoolYearId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }, _id: schoolYearId});
});

Meteor.publish('schoolYearComplete', function(schoolYearId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	let termIds = Terms.find({groupId: groupId, deletedOn: { $exists: false }, schoolYearId: schoolYearId}).map(term => term._id);

	return [
		SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }, _id: schoolYearId}),
		Terms.find({groupId: groupId, deletedOn: { $exists: false }, schoolYearId: schoolYearId}, {sort: {order: 1}}),
		Weeks.find({groupId: groupId, deletedOn: { $exists: false }, termId: {$in: termIds}}, {sort: {order: 1}}),
	];
});