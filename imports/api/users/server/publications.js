Meteor.users.rawCollection().createIndex({ 'info.groupId': 1 }, {name: "usersIndex"});

Meteor.publish('allUsers', function (){ 
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Meteor.users.find({'info.groupId': groupId}, {fields: {emails: 1, info: 1, group: 1, status: 1}});
});

Meteor.publish('userData', function() {
	if (!this.userId) {
		return this.ready();
	}

	return Meteor.users.find({_id: this.userId}, {fields: {emails: 1, info: 1, status: 1, presence: 1}});
});