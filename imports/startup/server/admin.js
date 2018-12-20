import {Groups} from '../../api/groups/groups.js';

// Create Application Admin Account
if (!Groups.find({appAdmin: true}).count()) {	
	let users = [
		{
			email: Meteor.settings.private.appAdmin.email,
			password: Meteor.settings.private.appAdmin.password,
			info: {
				firstName: 'Phillip',
				lastName: 'Gore',
				relationshipToStudents: 'Dad',
				role: 'Application Administrator',
				groupId: null,
			},
			status: {
				active: true,
				updatedOn: new Date(),
			}
		}

	]
		
	if (Meteor.settings.private.dev) {
		users.push(
			{
				email: Meteor.settings.private.dev.email,
				password: Meteor.settings.private.dev.password,
				info: {
					firstName: 'Test',
					lastName: 'Account',
					relationshipToStudents: 'Dad',
					role: 'Developer',
					groupId: null,
				},
				status: {
					active: true,
					updatedOn: new Date(),
				}
			}
		)
	}

	Groups.insert({subscriptionStatus: 'active', appAdmin: true}, function(error, result) {
		if (error) {
			console.log(error.reason);
		} else {
			users.forEach((user) => {
				user.info.groupId = result;
				let userId = Accounts.createUser(user);
				Meteor.users.update(userId, {$set: {"emails.0.verified" :true}});
			});
		}
	});
}

Meteor.methods({
	insertFreeTrial: function(user) {
		if (Accounts.findUserByEmail(user.email)) {
			throw new Meteor.Error(500, 'Email already exists.');
		} else {
			let groupId = Groups.insert({subscriptionStatus: 'active'});
			user.info.groupId = groupId;
			let userId = Accounts.createUser(user);
			Meteor.users.update(userId, {$set: {"emails.0.verified" :true}});
			return groupId;
		}
	},
})