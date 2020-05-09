import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Answers = new Mongo.Collection('answers');

Answers.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Answers.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const AnswersSchema = new SimpleSchema({
	questionId: {
        type: String,
        label: "Question Id",
    },
    optionIds: {
        type: Array,
        label: "Option Ids",
		optional: true
    },
	'optionIds.$': {
		type: String,
        label: "Option Ids",
        optional: true
	},
    textAnswer: {
        type: String,
        label: "Answer",
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

Answers.attachSchema(AnswersSchema);