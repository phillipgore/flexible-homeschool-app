import {Paths} from '../paths.js';

Meteor.publish('pathData', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Paths.find({groupId: groupId}, {fields: {groupId: 0, createdOn: 0}});
});