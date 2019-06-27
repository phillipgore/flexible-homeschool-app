import {Groups} from '../../api/groups/groups.js';

import moment from 'moment';

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

	adminGroupProperties = {
		subscriptionStatus: 'active', 
		appAdmin: true,
		initialIds: {
			studentId: 'empty',
			schoolYearId: 'empty',
			resourceId: 'empty',
			resourceType: 'empty',
			termId: 'empty',
			weekId: 'empty',
			schoolWorkId: 'empty',
			userId: 'empty',
			reportId: 'empty',
			groupId: 'empty',
		}
	}

	Groups.insert(adminGroupProperties, function(error, result) {
		if (error) {
			console.log(error.reason);
		} else {
			users.forEach((user) => {
				user.info.groupId = result;
				let userId = Accounts.createUser(user);
				Meteor.users.update(userId, {$set: {"emails.0.verified" :true}});
				Meteor.call('mcTags', result);
			});
		}
	});
};

Meteor.methods({
	insertFreeTrial: function(group, user) {
		if (Accounts.findUserByEmail(user.email)) {
			throw new Meteor.Error(500, 'Email already exists.');
		} else {
			let groupId = Groups.insert(group, function(error, result) {
				if (error) {
					throw new Meteor.Error(500, error.reason);
				} else {
					user.info.groupId = result;
					let userId = Accounts.createUser(user);
					Meteor.users.update(userId, {$set: {"emails.0.verified" :true}});
					Meteor.call('mcTags', result);


					SSR.compileTemplate('freeTrialEmail', Assets.getText('freeTrialEmail.html'));

					var emailData = {
						firstName: user.info.firstName,
						email: user.email,
						password: user.password,
						expiration: moment(group.freeTrial.expiration).format('MMMM D, YYYY'),
					};


					Email.send({
						to: user.email,
						from: "Flexible Homeschool App <no-reply@aflexiblehomeschool.com>",
						subject: "Free Trial - Flexible Homeschool App",
						html: SSR.render('freeTrialEmail', emailData),
					});
				}
			});
			return groupId;	
		}
	},

	impersonateAdmin: function(userId) {
		check(userId, String);

		if (!Meteor.users.findOne(userId)) {
			throw new Meteor.Error(404, 'User not found');
		}

		if (Meteor.user().info.role != 'Application Administrator') {
			throw new Meteor.Error(403, 'Permission denied');
		}

		this.setUserId(userId);
	},
});









