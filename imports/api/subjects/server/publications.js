import {Subjects} from '../subjects.js';
import {Resources} from '../../resources/resources.js';

Meteor.publish('allSubjects', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).group.groupId;

	return Subjects.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}});
});

Meteor.publish('subject', function(subjectId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).group.groupId;	
	return Subjects.find({groupId: groupId, deletedOn: { $exists: false }, _id: subjectId});
});

Meteor.publish('subjectResources', function(subjectId) {	
	if ( subjectId ) {
		let groupId = Meteor.users.findOne({_id: this.userId}).group.groupId;
		let subject = Subjects.findOne({groupId: groupId, deletedOn: { $exists: false }, _id: subjectId});

		return Resources.find({groupId: groupId, deletedOn: { $exists: false }, _id: {$in: subject.resources}});
	}
	return this.ready();
});
