import {StudentGroups} from '../studentGroups.js';

Meteor.publish('allStudentGroups', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return StudentGroups.find({groupId: groupId}, {sort: {name: 1}, fields: {name: 1}});
});