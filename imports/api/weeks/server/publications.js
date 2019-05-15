import {Weeks} from '../weeks.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Terms} from '../../terms/terms.js';
import {Lessons} from '../../lessons/lessons.js';
import {weekStatus} from '../../../modules/server/functions';
import _ from 'lodash'

Meteor.publish('allWeeks', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Weeks.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, termId: 1}});
});

Meteor.publish('schoolYearWeeks', function(schoolYearId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Weeks.find({schoolYearId: schoolYearId, groupId: groupId, deletedOn: { $exists: false }}, {fields: {_id: 1}});
});

Meteor.publish('termWeeks', function(termId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Weeks.find({termId: termId, groupId: groupId, deletedOn: { $exists: false }}, {sort: {termOrder: 1, order: 1}, fields: {groupId: 0, userId: 0, createdOn: 0, deletedOn: 0}})
});





