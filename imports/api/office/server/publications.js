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
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;

		let groups = Groups.find({appAdmin: false}, {fields: {subscriptionStatus: 1, appAdmin: 1, createdOn: 1}})
		let adminUsers = Meteor.users.find({'info.role': 'Administrator'}).fetch();

		groups.map((group) => {
			let user = _.filter(adminUsers, ['info.groupId', group._id]);
			group.userFirstName = user[0].info.firstName;
			group.userLastName = user[0].info.lastName;
			group.userEmail = user[0].emails[0].address;
			self.added('groups', group._id, group);
		});
		
		self.ready();
	});
});

Meteor.publish('allAccountTotals', function(groupId) {
	if (!this.userId) {
		return this.ready();
	}

	let activeGroupIds = Groups.find({appAdmin: false, subscriptionStatus: 'active', deletedOn: { $exists: false }}).map(group => (group._id));
	
	Counts.publish(this, 'allActiveAccountsCount', Groups.find({appAdmin: false, subscriptionStatus: 'active', deletedOn: { $exists: false }}));
	Counts.publish(this, 'allPausePendingAccountsCount', Groups.find({subscriptionStatus: 'pausePending', deletedOn: { $exists: false }}));
	Counts.publish(this, 'allPauseedAccountsCount', Groups.find({subscriptionStatus: 'paused', deletedOn: { $exists: false }}));
	Counts.publish(this, 'allErrorAccountsCount', Groups.find({subscriptionStatus: 'error', deletedOn: { $exists: false }}));

	Counts.publish(this, 'allAccountUsersCount', Meteor.users.find({'info.groupId': {$in: activeGroupIds}, 'status.active': true, deletedOn: { $exists: false }}));

	Counts.publish(this, 'allAccountStudentsCount', Students.find({deletedOn: { $exists: false }}));
	Counts.publish(this, 'allAccountSchoolYearsCount', SchoolYears.find({deletedOn: { $exists: false }}));
	Counts.publish(this, 'allAccountTermsCount', Terms.find({deletedOn: { $exists: false }}));
	Counts.publish(this, 'allAccountWeeksCount', Weeks.find({deletedOn: { $exists: false }}));
	Counts.publish(this, 'allAccountResourcesCount', Resources.find({deletedOn: { $exists: false }}));
	Counts.publish(this, 'allAccountSchoolWorkCount', SchoolWork.find({deletedOn: { $exists: false }}));
	Counts.publish(this, 'allAccountLessonsCount', Lessons.find({deletedOn: { $exists: false }}));
	Counts.publish(this, 'allAccountReportsCount', Reports.find({deletedOn: { $exists: false }}));
});

Meteor.publish('account', function(groupId) {
	if (!this.userId) {
		return this.ready();
	}

	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;

		let groups = Groups.find({appAdmin: false}, {fields: {subscriptionStatus: 1, appAdmin: 1, createdOn: 1}})
		let users = Meteor.users.find({'info.groupId': groupId});

		users.map((user) => {
			self.added('users', user._id, user);
		})
		

		self.ready();
	});
});

Meteor.publish('accountTotals', function(groupId) {
	if (!this.userId) {
		return this.ready();
	}
	
	Counts.publish(this, 'accountUsersCount', Meteor.users.find({'info.groupId': groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'accountStudentsCount', Students.find({groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'accountSchoolYearsCount', SchoolYears.find({groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'accountTermsCount', Terms.find({groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'accountWeeksCount', Weeks.find({groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'accountResourcesCount', Resources.find({groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'accountSchoolWorkCount', SchoolWork.find({groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'accountLessonsCount', Lessons.find({groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'accountReportsCount', Reports.find({groupId: groupId, deletedOn: { $exists: false }}));
});





