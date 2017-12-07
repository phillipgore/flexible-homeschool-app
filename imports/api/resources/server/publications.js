import {Resources} from '../resources.js';

Meteor.publish('allResources', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Resources.find({groupId: groupId}, {sort: {title: 1}});
});