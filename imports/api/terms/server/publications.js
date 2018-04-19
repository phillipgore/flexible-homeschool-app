import {Terms} from '../terms.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {termStatusAndUrlIds} from '../../../modules/server/functions';

Meteor.publish('allTerms', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	let subHandle = Terms
		.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, schoolYearId: 1}})
		.observeChanges({
			added: (id, term) => {
				term = termStatusAndUrlIds(term);
				this.added('terms', id, term);
			},
			changed: (id, term) => {
				term = termStatusAndUrlIds(term);
				this.changed('terms', id, term);
			},
			removed: (id) => {
				this.removed('terms', id);
			}
		});
	this.ready();
	this.onStop(() => {
		subHandle.stop();
	});
});

Meteor.publish('termsPath', function(schoolYearId, studentId) {
	if (!this.userId) {
		return this.ready();
	}
	console.log(schoolYearId)
	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	let subHandle = Terms
		.find({schoolYearId: schoolYearId, groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, schoolYearId: 1}})
		.observeChanges({
			added: (id, term) => {
				term = termStatusAndUrlIds(term, studentId);
				this.added('terms', id, term);
			},
			changed: (id, term) => {
				term = termStatusAndUrlIds(term, studentId);
				this.changed('terms', id, term);
			},
			removed: (id) => {
				this.removed('terms', id);
			}
		});
	this.ready();
	this.onStop(() => {
		subHandle.stop();
	});
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