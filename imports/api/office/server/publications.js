Meteor.publish('allAccounts', function() {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;

		Groups.find({appAdmin: false}).map((group) => {
			let user = Meteor.users.findOne({groupId: group._id, 'info.role': 'Administrator'});
			group.userFirstName = user.firstName;
			group.userLastName = user.lastName;
			group.userRelationshipToStudents = user.relationshipToStudents;
			group.userRole = user.info.role;
			self.added('groups', group._id, group);
		});
		

		self.ready();
	});
});