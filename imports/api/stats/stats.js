import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Stats = new Mongo.Collection('stats');

Stats.allow({
	insert: () => false,
	update: () => false,
	remove: () => false
});

Stats.deny({
	insert: () => true,
	update: () => true,
	remove: () => true
});

const StatsSchema = new SimpleSchema({
	studentId: {
		type: String,
		label: "Student ID",
        optional: true
    },
	studentGroupId: {
        type: String,
        label: "Student Group ID",
        optional: true
    },
	timeFrameId: {
		type: String,
		label: "Time Frame ID"
	},
	type: {
		type: String,
		label: "Type",
		allowedValues: ['schoolYear', 'term', 'week']
	},
	lessonCount: {
		type: Number,
		label: "Lessons Count",
	},
	completedLessonCount: {
		type: Number,
		label: "Completed Lessons Count",
	},
	assignedLessonCount: {
		type: Number,
		label: "Assigned Lessons Count",
	},
	completedLessonPercentage: {
		type: Number,
		label: "Completed Lesson Percentage",
	},
	status: {
		type: String,
		label: "Status",
	},

	groupId: {
		type: String,
		label: "Group ID",
		// autoValue: function() {
		// 	if ( this.isInsert ) {
		// 		return Meteor.user().info.groupId;
		// 	}
		// }
	},
	createdOn: {
		type: Date,
		label: "Created On Date",
		autoValue: function() {
			if ( this.isInsert ) {
				return new Date();
			}
		}
	},
	updatedOn: {
		type: Date,
		label: "Updated On Date",
		optional: true,
		autoValue: function() {
			if ( this.isUpdate ) {
				return new Date();
			}
		}
	},
});

Stats.attachSchema(StatsSchema);





