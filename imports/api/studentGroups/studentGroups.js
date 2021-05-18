import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const StudentGroups = new Mongo.Collection('studentGroups');

StudentGroups.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

StudentGroups.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const StudentGroupsSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Student Grouping Name"
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

StudentGroups.attachSchema(StudentGroupsSchema);