import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Lessons = new Mongo.Collection('lessons');

if ( Meteor.isServer ) {
    Lessons.rawCollection().createIndex({weekId: 1, schoolWorkId: 1, order: 1}, {name: "lessonsIndex"});
    Lessons.rawCollection().createIndex({completed: 1, assigned: 1, schoolWorkId: 1, deletedOn: 1}, {name: "lessonsIndexTwo"});
    Lessons.rawCollection().createIndex({completed: 1, schoolWorkId: 1, deletedOn: 1}, {name: "lessonsIndexThree"});
    Lessons.rawCollection().createIndex({schoolWorkId: 1, deletedOn: 1}, {name: "lessonsIndexFour"});
    Lessons.rawCollection().createIndex({weekId: 1, completed: 1, schoolWorkId: 1, deletedOn: 1}, {name: "lessonsIndexFive"});
    Lessons.rawCollection().createIndex({groupId: 1, weekId: 1, schoolWorkId: 1, order: 1, deletedOn: 1}, {name: "lessonsIndexSix"});
    Lessons.rawCollection().createIndex({groupId: 1, weekId: 1, order: 1, deletedOn: 1}, {name: "lessonsIndexSeven"});
    Lessons.rawCollection().createIndex({schoolWorkId: 1, weekId: 1, deletedOn: 1}, {name: "lessonsIndexEight"});
    Lessons.rawCollection().createIndex({completed: 1, schoolWorkId: 1, weekId: 1, deletedOn: 1}, {name: "lessonsIndexNine"});
    Lessons.rawCollection().createIndex({weekId: 1, schoolWorkId: 1, deletedOn: 1}, {name: "lessonsIndexTen"});
    Lessons.rawCollection().createIndex({groupId: 1, deletedOn: 1}, {name: "lessonsIndexEleven"});
}

Lessons.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Lessons.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const LessonsSchema = new SimpleSchema({
	order: {
        type: Number,
        label: "Order",
    },
    weekOrder: {
        type: Number,
        label: "Week Order"
    },
    termOrder: {
        type: Number,
        label: "Term Order"
    },
    assigned: {
    	type: Boolean,
		label: "Assigned",
		defaultValue: false,
    },
	completed: {
		type: Boolean,
		label: "Completed",
		defaultValue: false,
	},
	completedOn: {
        type: Date,
        label: "Completed On",
        optional: true
    },
    completionTime: {
        type: Number,
        label: "Completion Time",
        optional: true
    },
    description: {
        type: String,
        label: "Description",
        optional: true
    },
    schoolWorkId: {
        type: String,
        label: "School Work ID"
    },
    schoolYearId: {
        type: String,
        label: "School Year ID"
    },
    termId: {
        type: String,
        label: "Term ID"
    },
    weekId: {
        type: String,
        label: "Week ID"
    },
    studentId: {
        type: String,
        label: "School Work ID"
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

Lessons.attachSchema(LessonsSchema);