import {Weeks} from '../weeks.js';
import {SchoolYears} from '../../schoolYears/schoolYears.js';
import {Terms} from '../../terms/terms.js';
import {Lessons} from '../../lessons/lessons.js';
import {weekStatus} from '../../../modules/server/functions';

Meteor.publish('allWeeks', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Weeks.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {order: 1, termId: 1}});
});

Meteor.publish('weeksPath', function(termId, studentId) {
	this.autorun(function (computation) {
		if (!this.userId) {
			return this.ready();
		}

		SchoolYears.find();
		Terms.find();
		Lessons.find();

		let self = this;

		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let weeks = Weeks.find({termId: termId, groupId: groupId, deletedOn: { $exists: false }}, {sort: {order: 1}, fields: {groupId: 0, userId: 0, createdOn: 0}});

		weeks.map((week) => {
			week = weekStatus(week, week._id, studentId);
			self.added('weeks', week._id, week);
		});

		self.ready();
	});
});




