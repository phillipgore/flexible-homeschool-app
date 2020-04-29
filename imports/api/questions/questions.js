import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Questions = new Mongo.Collection('questions');

Questions.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Questions.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const QuestionsSchema = new SimpleSchema({
	order: {
        type: Number,
        label: "Question Order",
        optional: true
    },
    question: {
        type: String,
        label: "Question",
    },
    type: {
        type: String,
        label: "Question Type",
        allowedValues: ['boolean', 'text', 'boolWithText'],
    },
    active: {
		type: Boolean,
		label: "Is Question Active",
		defaultValue: true,
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

Questions.attachSchema(QuestionsSchema);