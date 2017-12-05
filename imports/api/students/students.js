import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Students = new Mongo.Collection('students');

Students.deny({
	insert() {return true; },
	update() {return true; },
	remove() {return true; },
});

const StudentsSchema = new SimpleSchema({
	firstName: {
        type: String,
        label: "First Name"
    },
    middleName: {
        type: String,
        label: "Middle Name",
        optional: true
    },
    lastName: {
        type: String,
        label: "Last Name"
    },
    preferredFirstName: {
        type: String,
        label: "Goes By"
    },
    birthday: {
        type: Date,
        label: "Birthday"
    },
	archived: {
		type: Boolean,
		defaultValue: false,
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
	}
});

Students.attachSchema(StudentsSchema);