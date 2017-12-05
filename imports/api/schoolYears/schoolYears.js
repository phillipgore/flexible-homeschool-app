import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const SchoolYears = new Mongo.Collection('schoolYears');

SchoolYears.deny({
	insert() {return true; },
	update() {return true; },
	remove() {return true; },
});

const SchoolYearsSchema = new SimpleSchema({
	startYear: {
        type: String,
        label: 'Start Year',
    },
    endYear: {
        type: String,
        label: 'End Year',
    },
	archived: {
		type: Boolean,
		defaultValue: false,
	},
	terms: {
		type: Array,
		label: 'Terms',
	},
    "terms.$": {
        type: Object
    },
    "terms.$.order": {
        type: Number,
        label: 'Terms Order',
    },
    "terms.$.weeksPerTerm": {
        type: Number,
        label: 'Weeks Per Term',
    },
	groupId: {
		type: String,
		label: 'Group ID',
		autoValue: function() {
			if ( this.isInsert ) {
				return Meteor.user().info.groupId;
			}
		}
	},
	userId: {
		type: String,
		label: 'User ID',
		autoValue: function() {
			if ( this.isInsert ) {
				return Meteor.userId();
			}
		}
	},
	createdOn: {
		type: Date,
		label: 'Created On Date',
		autoValue: function() {
			if ( this.isInsert ) {
				return new Date();
			}
		}
	},
	updatedOn: {
		type: Date,
		label: 'Updated On Date',
		optional: true,
		autoValue: function() {
			if ( this.isUpdate ) {
				return new Date();
			}
		}
	}
});

SchoolYears.attachSchema(SchoolYearsSchema);