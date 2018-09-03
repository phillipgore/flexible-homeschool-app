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

	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		let self = this;

		let groups = Groups.find({appAdmin: false}, {fields: {subscriptionStatus: 1, appAdmin: 1, createdOn: 1}})
		let users = Meteor.users.find({'info.groupId': groupId});

		groups.map((group) => {
			let user = Meteor.users.findOne({'info.groupId': group._id, 'info.role': 'Administrator'});
			group.userFirstName = user.info.firstName;
			group.userLastName = user.info.lastName;
			group.userEmail = user.emails[0].address;
			self.added('groups', group._id, group);
		});

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





