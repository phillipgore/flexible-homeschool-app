import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Plans = new Mongo.Collection('plans');

Plans.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Plans.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const PlansSchema = new SimpleSchema({
	planId: {
		type: String,
		label: "Plan Id",
	},
	label: {
		type: String,
		label: "Label",
	},
	price: {
		type: Number,
		label: "Price",
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

Plans.attachSchema(PlansSchema);