import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Terms = new Mongo.Collection('terms');

if ( Meteor.isServer ) {
    Terms.rawCollection().createIndex({ groupId: 1, schoolYearId: 1, order: 1 }, {name: "termsIndex"});
}

Terms.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Terms.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const TermsSchema = new SimpleSchema({
	order: {
        type: Number,
        label: "order",
    	optional: true
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

Terms.attachSchema(TermsSchema);