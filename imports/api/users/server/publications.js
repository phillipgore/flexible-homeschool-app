Meteor.publish('allUsers', function (){ 
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).group.groupId;
	return Meteor.users.find({'group.groupId': groupId}, {fields: {emails: 1, info: 1, group: 1, status: 1}});
});

Meteor.publish('user', function(userId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).group.groupId;
	return Meteor.users.find({'group.groupId': groupId}, {fields: {emails: 1, info: 1, group: 1, status: 1}}, {sort: {'info.lastName': 1, 'info.firstName': 1}});
});