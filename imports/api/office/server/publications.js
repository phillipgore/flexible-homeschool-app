import {Groups} from '../../groups/groups.js';

Meteor.publish('allAccounts', function() {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;

		let groups = Groups.find({appAdmin: false}, {fields: {subscriptionStatus: 1, appAdmin: 1, createdOn: 1}})

		groups.map((group) => {
			let user = Meteor.users.findOne({'info.groupId': group._id, 'info.role': 'Administrator'});
			group.userFirstName = user.info.firstName;
			group.userLastName = user.info.lastName;
			group.userEmail = user.emails[0].address;
			self.added('groups', group._id, group);
		});
		

		self.ready();
	});
});

Meteor.publish('account', function(groupId) {
	if (!this.userId) {
		return this.ready();
	}

	return [
		Groups.find({_id: groupId}),
		Meteor.users.find({'info.groupId': groupId})
	]
})