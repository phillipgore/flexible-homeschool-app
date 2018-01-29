import {Terms} from '../terms.js';

Meteor.publish('allTerms', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).group.groupId;
	return Terms.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}});
});

Meteor.publish('schoolYearsTerms', function(schoolYearId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).group.groupId;
	return Terms.find({groupId: groupId, deletedOn: { $exists: false }, schoolYearId: schoolYearId}, {sort: {order: 1}});
});