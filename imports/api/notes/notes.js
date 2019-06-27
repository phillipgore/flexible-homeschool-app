import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Notes = new Mongo.Collection('notes');

Notes.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Notes.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const NotesSchema = new SimpleSchema({
	weekId: {
		type: String,
		label: "Week ID"
	},
	schoolWorkId: {
		type: String,
		label: "School Work ID"
	},
	note: {
		type: String,
		label: "Note",
		optional: true
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

Notes.attachSchema(NotesSchema);