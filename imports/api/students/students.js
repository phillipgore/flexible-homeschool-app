import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Students = new Mongo.Collection('students');

if ( Meteor.isServer ) {
    Students.rawCollection().createIndex({ groupId: 1, birthday: 1, lastName: 1 }, {name: "studentsIndex"});
}

Students.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Students.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
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
    nickname: {
        type: String,
        label: "Nickname",
        optional: true
    },
    preferredFirstName: {
        type: Object,
        label: "Goes By"
    },
    'preferredFirstName.type': {
        type: String,
        label: "Goes By"
    },
    'preferredFirstName.name': {
        type: String,
        label: "Goes By"
    },
    birthday: {
        type: Date,
        label: "Birthday"
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

Students.attachSchema(StudentsSchema);