import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Subjects = new Mongo.Collection('subjects');

Subjects.deny({
	insert() {return true; },
	update() {return true; },
	remove() {return true; },
});

const SubjectsSchema = new SimpleSchema({
	order: {
        type: Number,
        label: "Order"
    },
    label: {
        type: String,
        label: "Label",
    },
    description: {
        type: String,
        label: "Description",
        optional: true
    },
    schedule: {
    	type: Object,
    	label: "Schedule"
    },
    'schedule.weekOfTerm': {
        type: Number,
        label: "Week Of Term"
    },
    'schedule.lessonsPerWeek': {
        type: Number,
        label: "Lessons Per Week"
    },
	archived: {
		type: Boolean,
		defaultValue: false,
	},
    termId: {
        type: String,
        label: "Student ID"
    },
    studentId: {
        type: String,
        label: "Student ID"
    },
	groupId: {
		type: String,
		label: "Group ID",
		autoValue: function() {
			if ( this.isInsert ) {
				return Meteor.user().info.groupId;
			}
		}
	},
	userId: {
		type: String,
		label: "User ID",
		autoValue: function() {
			if ( this.isInsert ) {
				return Meteor.userId();
			}
		}
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
	}
});

Subjects.attachSchema(SubjectsSchema);