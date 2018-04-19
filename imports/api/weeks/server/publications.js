import {Weeks} from '../weeks.js';
import {Terms} from '../../terms/terms.js';
import {weekStatsAndUrlIds} from '../../../modules/server/functions';

Meteor.publish('allWeeks', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	let subHandle = Weeks
		.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}})
		.observeChanges({
			added: (id, week) => {
				week = weekStatsAndUrlIds(week);
				this.added('weeks', id, week);
			},
			changed: (id, week) => {
				week = weekStatsAndUrlIds(week);
				this.changed('weeks', id, week);
			},
			removed: (id) => {
				this.removed('weeks', id);
			}
		});
	this.ready();
	this.onStop(() => {
		subHandle.stop();
	});
});

Meteor.publish('firstWeeks', function(schoolYearId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	let termIds = Terms.find({schoolYearId: schoolYearId}).map(term => (term._id));
	let weekIds = [];

	termIds.forEach(function(termId) {
		weekIds.push(Weeks.findOne({groupId: groupId, deletedOn: { $exists: false }, termId: termId}, {sort: {order: 1}})._id)
	})

	return Weeks.find({_id: {$in: weekIds}, groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}});
});

Meteor.publish('allWeeksProgress', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Weeks.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {termId: 1}});
});

Meteor.publish('termWeeks', function(termId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Weeks.find({groupId: groupId, deletedOn: { $exists: false }, termId: termId}, {sort: {order: 1}});
});