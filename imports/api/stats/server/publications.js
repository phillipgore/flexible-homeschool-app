import {Groups} from '../../groups/groups.js';
import {Counts} from 'meteor/tmeasday:publish-counts';
import {Stats} from '../../stats/stats.js';
import {Students} from '../../students/students.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Resources} from '../../resources/resources.js';
import {SchoolWork} from '../../schoolWork/schoolWork.js';
import {Weeks} from '../../weeks/weeks.js';
import {Lessons} from '../../lessons/lessons.js';
import {Reports} from '../../reports/reports.js';

import _ from 'lodash';

Meteor.publish('schoolWorkStats', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	Counts.publish(this, 'schoolWorkCount', SchoolWork.find({groupId: groupId, deletedOn: { $exists: false }}));
});

Meteor.publish('resourceStats', function() {
	if (!this.userId) {
		return this.ready();
	}
	
	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	Counts.publish(this, 'allAllCount', Resources.find({groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'bookAllCount', Resources.find({type: 'book', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'linkAllCount', Resources.find({type: 'link', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'videoAllCount', Resources.find({type: 'video', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'audioAllCount', Resources.find({type: 'audio', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'appAllCount', Resources.find({type: 'app', groupId: groupId, deletedOn: { $exists: false }}));

	Counts.publish(this, 'allOwnCount', Resources.find({availability: 'own', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'bookOwnCount', Resources.find({type: 'book', availability: 'own', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'linkOwnCount', Resources.find({type: 'link', availability: 'own', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'videoOwnCount', Resources.find({type: 'video', availability: 'own', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'audioOwnCount', Resources.find({type: 'audio', availability: 'own', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'appOwnCount', Resources.find({type: 'app', availability: 'own', groupId: groupId, deletedOn: { $exists: false }}));

	Counts.publish(this, 'allBorrowedCount', Resources.find({availability: 'borrowed', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'bookBorrowedCount', Resources.find({type: 'book', availability: 'borrowed', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'linkBorrowedCount', Resources.find({type: 'link', availability: 'borrowed', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'videoBorrowedCount', Resources.find({type: 'video', availability: 'borrowed', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'audioBorrowedCount', Resources.find({type: 'audio', availability: 'borrowed', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'appBorrowedCount', Resources.find({type: 'app', availability: 'borrowed', groupId: groupId, deletedOn: { $exists: false }}));

	Counts.publish(this, 'allNeedCount', Resources.find({availability: 'need', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'bookNeedCount', Resources.find({type: 'book', availability: 'need', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'linkNeedCount', Resources.find({type: 'link', availability: 'need', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'videoNeedCount', Resources.find({type: 'video', availability: 'need', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'audioNeedCount', Resources.find({type: 'audio', availability: 'need', groupId: groupId, deletedOn: { $exists: false }}));
	Counts.publish(this, 'appNeedCount', Resources.find({type: 'app', availability: 'need', groupId: groupId, deletedOn: { $exists: false }}));
});

Meteor.publish('progressStatsPub', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Stats.find({groupId: groupId}, {fields: {createdOn: 0, updatedOn: 0}});
});