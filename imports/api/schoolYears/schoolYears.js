import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const SchoolYears = new Mongo.Collection('schoolYears');

SchoolYears.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

SchoolYears.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
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
	},
	deletedOn: {
		type: Date,
		label: "Deleted On Date",
        optional: true
	}
});

SchoolYears.attachSchema(SchoolYearsSchema);