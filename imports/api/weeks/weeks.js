import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Weeks = new Mongo.Collection('weeks');

if ( Meteor.isServer ) {
    Weeks.rawCollection().createIndex({ termId: 1, order: 1 }, {name: "weeksIndex"});
    Weeks.rawCollection().createIndex({groupId: 1, order: 1, deletedOn: 1}, {name: "weeksIndexTwo"});
}

Weeks.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Weeks.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const WeeksSchema = new SimpleSchema({
	order: {
        type: Number,
        label: "Order"
    },
    termOrder: {
        type: Number,
        label: "Term Order"
    },
    schoolYearId: {
        type: String,
        label: "School Year ID"
    },
    termId: {
        type: String,
        label: "Term ID"
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

Weeks.attachSchema(WeeksSchema);