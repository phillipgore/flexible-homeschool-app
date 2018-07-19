import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Subjects = new Mongo.Collection('subjects');

Subjects.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Subjects.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const SubjectsSchema = new SimpleSchema({
	order: {
        type: Number,
        label: "Order",
        optional: true
    },
    name: {
        type: String,
        label: "Subject Name",
    },
    description: {
        type: String,
        label: "Description",
        optional: true
    },
    resources: {
        type: Array,
        label: "Attached Resources",
		optional: true
    },
	'resources.$': {
		type: String,
        label: "Attached Resource",
	},
    studentId: {
        type: String,
        label: "Student ID"
    },
    schoolYearId: {
        type: String,
        label: "School Year ID"
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
	},
	deletedOn: {
		type: Date,
		label: "Deleted On Date",
        optional: true
	}
});

Subjects.attachSchema(SubjectsSchema);