import {Weeks} from '../weeks.js';

Meteor.publish('allWeeks', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).group.groupId;
	return Weeks.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}});
});

Meteor.publish('termWeeks', function(termId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).group.groupId;
	return Weeks.find({groupId: groupId, deletedOn: { $exists: false }, termId: termId}, {sort: {order: 1}});
});