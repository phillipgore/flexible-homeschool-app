import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Reports = new Mongo.Collection('reports');

if ( Meteor.isServer ) {
	Reports.rawCollection().dropIndex("reportsIndex");
    // Reports.rawCollection().createIndex({ name: 1 }, {name: "reportsIndex"});
}

Reports.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Reports.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const ReportsSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Subject Name",
    },

    // School Years
    schoolYearReportVisible: {
		type: Boolean,
		label: "School Year Report",
		defaultValue: true,
	},
	schoolYearStatsVisible: {
		type: Boolean,
		label: "School Year Stats",
		defaultValue: true,
	},
	schoolYearProgressVisible: {
		type: Boolean,
		label: "School Year Progress",
		defaultValue: true,
	},
	schoolYearTimesVisible: {
		type: Boolean,
		label: "School Year Times",
		defaultValue: true,
	},

	// Terms
	termsReportVisible: {
		type: Boolean,
		label: "Terms Report",
		defaultValue: false,
	},
	termsStatsVisible: {
		type: Boolean,
		label: "Terms Stats",
		defaultValue: true,
	},
	termsProgressVisible: {
		type: Boolean,
		label: "Terms Progress",
		defaultValue: true,
	},
	termsTimesVisible: {
		type: Boolean,
		label: "Terms Times",
		defaultValue: true,
	},
	
	// Subjects
	subjectsReportVisible: {
		type: Boolean,
		label: "Subjects Report",
		defaultValue: true,
	},
	subjectsStatsVisible: {
		type: Boolean,
		label: "Subjects Stats",
		defaultValue: true,
	},
	subjectsProgressVisible: {
		type: Boolean,
		label: "Subjects Progress",
		defaultValue: true,
	},
	subjectsTimesVisible: {
		type: Boolean,
		label: "Subjects Times",
		defaultValue: true,
	},
	subjectsResourcesVisible: {
		type: Boolean,
		label: "Subjects Resources",
		defaultValue: true,
	},

	// Resources
	resourcesReportVisible: {
		type: Boolean,
		label: "Resources Report",
		defaultValue: false,
	},
	resourcesOriginatorVisible: {
		type: Boolean,
		label: "Resources Originator",
		defaultValue: true,
	},
	resourcesPublicationVisible: {
		type: Boolean,
		label: "Resources Publication",
		defaultValue: true,
	},
	resourcesSubjectsVisible: {
		type: Boolean,
		label: "Resources Subjects",
		defaultValue: true,
	},
	resourcesLinkVisible: {
		type: Boolean,
		label: "Resources Link",
		defaultValue: true,
	},
	resourcesDescriptionVisible: {
		type: Boolean,
		label: "Resources Description",
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
	},
	deletedOn: {
		type: Date,
		label: "Deleted On Date",
        optional: true
	}
});

Reports.attachSchema(ReportsSchema);