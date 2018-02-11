import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Groups = new Mongo.Collection('groups');

Groups.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Groups.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const GroupsSchema = new SimpleSchema({
	stripeCustomerId: {
        type: String,
        label: "Stripe Customer ID",
        optional: true
    },
    stripeSubscriptionId: {
        type: String,
        label: "Stripe Subscription ID",
        optional: true
    },
    stripeCardId: {
        type: String,
        label: "Stripe Card ID",
        optional: true
    },
	subscriptionStatus: {
		type: String,
		label: "Subscription Status",
        optional: true
	},
	subscriptionError: {
		type: Object,
		label: "Subscription Error",
        optional: true
	},
	'subscriptionError.message': {
        type: String,
        label: "Subscription Error Message",
        optional: true
    },
	'subscriptionError.type': {
        type: String,
        label: "Subscription Error Type",
        optional: true
    },
	'subscriptionError.param': {
        type: String,
        label: "Subscription Error Param",
        optional: true
    },
	'subscriptionError.code': {
        type: String,
        label: "Subscription Error Code",
        optional: true
    },
	'subscriptionError.statusCode': {
        type: String,
        label: "Subscription Status",
        optional: true
    },
	'subscriptionError.requestId': {
        type: String,
        label: "Subscription ID",
        optional: true
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

Groups.attachSchema(GroupsSchema);