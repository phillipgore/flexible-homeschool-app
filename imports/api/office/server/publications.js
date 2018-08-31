Meteor.publish('allAccounts', function (){ 
	if (!this.userId) {
		return this.ready();
	}

	return Meteor.users.find({'info.role': 'Administrator'}, {fields: {'info.firstName': 1, 'info.lastName': 1, 'info.relationshipToStudents': 1, 'info.role': 1}});
});