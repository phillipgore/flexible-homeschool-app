import {SchoolYears} from '../schoolYears.js';

Meteor.publish('allSchoolYears', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).group.groupId;
	return SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {startYear: 1}});
});

Meteor.publish('schoolYear', function(schooYearId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).group.groupId;
	return SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }, _id: schooYearId});
});