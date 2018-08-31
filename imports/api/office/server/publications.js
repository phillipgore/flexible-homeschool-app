Meteor.publish('allAccounts', function (){ 
	if (!this.userId || Meteor.users.findOne({ _id: this.userId }).info.role != 'Application Administrator') {
		return this.ready();
	}

	return Meteor.users.find({'info.role': 'Administrator'}, {fields: {'info.firstName': 1, 'info.lastName': 1, 'info.relationshipToStudents': 1}});
});