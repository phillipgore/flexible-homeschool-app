import {Counts} from 'meteor/tmeasday:publish-counts';
import {Groups} from '../../groups/groups.js';
import {Students} from '../../students/students.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Terms} from '../../terms/terms.js';
import {Weeks} from '../../weeks/weeks.js';
import {Resources} from '../../resources/resources.js';
import {SchoolWork} from '../../schoolWork/schoolWork.js';
import {Lessons} from '../../lessons/lessons.js';
import {Reports} from '../../reports/reports.js';

import _ from 'lodash';


Meteor.publish('allAccounts', function() {
		if (!this.userId) {
			return this.ready();
		}

		return [
			Groups.find({appAdmin: false}, {fields: {subscriptionStatus: 1, appAdmin: 1, freeTrial: 1, createdOn: 1}}),
			Meteor.users.find({'info.role': 'Administrator'}, {fields: {createdAt: 1, 'info.groupId': 1, 'info.firstName': 1, 'info.lastName': 1, 'info.role': 1, emails: 1, 'presence': 1}}),
		]
});

Meteor.publish('allAccountTotals', function(groupId) {
	if (!this.userId) {
		return this.ready();
	}

	let activeGroupIds = Groups.find({appAdmin: false, subscriptionStatus: 'active'}).map(group => (group._id));
	
	Counts.publish(this, 'allOnlineCount', Meteor.users.find({'info.groupId': {$in: activeGroupIds}, 'status.active': true, 'presence.status': 'online'}));
	Counts.publish(this, 'allActiveAccountsCount', Groups.find({appAdmin: false, subscriptionStatus: 'active'}));
	Counts.publish(this, 'allPausePendingAccountsCount', Groups.find({subscriptionStatus: 'pausePending'}));
	Counts.publish(this, 'allPauseedAccountsCount', Groups.find({subscriptionStatus: 'paused'}));
	Counts.publish(this, 'allErrorAccountsCount', Groups.find({subscriptionStatus: 'error'}));
});

Meteor.publish('account', function(groupId) {
	if (!this.userId) {
		return this.ready();
	}

	return [
		Groups.find({groupId: groupId, appAdmin: false}, {fields: {initialIds: 1, subscriptionStatus: 1, appAdmin: 1, freeTrial: 1, createdOn: 1}}),
		Meteor.users.find({'info.groupId': groupId}),
	]
});

Meteor.publish('accountTotals', function(groupId) {
	if (!this.userId) {
		return this.ready();
	}
	
	Counts.publish(this, 'accountUsersCount', Meteor.users.find({'info.groupId': groupId}));
	Counts.publish(this, 'accountStudentsCount', Students.find({groupId: groupId}));
	Counts.publish(this, 'accountSchoolYearsCount', SchoolYears.find({groupId: groupId}));
	Counts.publish(this, 'accountTermsCount', Terms.find({groupId: groupId}));
	Counts.publish(this, 'accountWeeksCount', Weeks.find({groupId: groupId}));
	Counts.publish(this, 'accountResourcesCount', Resources.find({groupId: groupId}));
	Counts.publish(this, 'accountSchoolWorkCount', SchoolWork.find({groupId: groupId}));
	Counts.publish(this, 'accountLessonsCount', Lessons.find({groupId: groupId}));
	Counts.publish(this, 'accountReportsCount', Reports.find({groupId: groupId}));
});





