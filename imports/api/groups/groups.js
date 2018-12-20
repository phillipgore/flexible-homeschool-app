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
    stripePaymentAttempt: {
        type: Number,
        label: "Stripe Payment Attempt",
        optional: true
    },
    stripeCouponCodes: {
        type: Array,
        label: "Stripe Coupon Codes",
        optional: true
    },
    'stripeCouponCodes.$': {
        type: String,
        label: "Stripe Coupon Code",
    },
	subscriptionStatus: {
		type: String,
		label: "Account Status",
        optional: true
	},
    subscriptionPausedOn: {
        type: Date,
        label: "Account Paused On Date",
        optional: true
    },
	subscriptionErrorMessage: {
        type: String,
        label: "Subscription Error Message",
        optional: true
    },
    freeTrial: {
        type: Object,
        label: "Free Trial",
        optional: true
    },
    'freeTrial.createdAs': {
        type: Boolean,
        label: "Created As A Free Trial",
        defaultValue: false,
        optional: true
    },
    'freeTrial.expiration': {
        type: Date,
        label: "Free Trial Expiration Date",
        optional: true
    },
    appAdmin: {
        type: Boolean,
        label: "Application Admin Group",
        defaultValue: false,
    },
    testData: {
        type: Boolean,
        label: "Test Data",
        defaultValue: false,
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