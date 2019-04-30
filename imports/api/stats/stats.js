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
		label: "Student ID"
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
});

Stats.attachSchema(StatsSchema);




