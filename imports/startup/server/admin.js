import {Groups} from '../../api/groups/groups.js';

// Create Application Admin Account
if (!Groups.find({appAdmin: true}).count()) {	
	let users = [
		{
			email: 'admin@allnaturalapps.com',
			password: '6578ayanal6578',
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
		},
		{
			email: 'dev@test.com',
			password: 'dev',
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
	]

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