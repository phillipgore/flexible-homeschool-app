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
			},
			reportSettings: {
				schoolYearReportVisible: true,
				schoolYearStatsVisible: true,
				schoolYearProgressVisible: true,
				schoolYearTimesVisible: true,

				termsReportVisible: false,
				termsStatsVisible: true,
				termsProgressVisible: true,
				termsTimesVisible: true,
				
				subjectsReportVisible: true,
				subjectsStatsVisible: true,
				subjectsProgressVisible: true,
				subjectsTimesVisible: true,
				subjectsResourcesVisible: true,

				resourcesReportVisible: false,
				resourcesOriginatorVisible: true,
				resourcesPublicationVisible: true,
				resourcesSubjectsVisible: true,
				resourcesLinkVisible: true,
				resourcesDescriptionVisible: true,
				
				lessonsReportVisible: false,
				lessonsDateVisible: true,
				lessonsTimeVisible: true,
				lessonsDescriptionVisible: false,
			}
		},
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
			},
			reportSettings: {
				schoolYearReportVisible: true,
				schoolYearStatsVisible: true,
				schoolYearProgressVisible: true,
				schoolYearTimesVisible: true,

				termsReportVisible: false,
				termsStatsVisible: true,
				termsProgressVisible: true,
				termsTimesVisible: true,
				
				subjectsReportVisible: true,
				subjectsStatsVisible: true,
				subjectsProgressVisible: true,
				subjectsTimesVisible: true,
				subjectsResourcesVisible: true,

				resourcesReportVisible: false,
				resourcesOriginatorVisible: true,
				resourcesPublicationVisible: true,
				resourcesSubjectsVisible: true,
				resourcesLinkVisible: true,
				resourcesDescriptionVisible: true,
				
				lessonsReportVisible: false,
				lessonsDateVisible: true,
				lessonsTimeVisible: true,
				lessonsDescriptionVisible: false,
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