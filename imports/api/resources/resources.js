import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Resources = new Mongo.Collection('resources');

Resources.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Resources.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

const ResourcesSchema = new SimpleSchema({
	type: {
        type: String,
        label: "Type",
        allowedValues: ['book', 'link', 'video', 'audio', 'app']
    },
    searchIndex: {
        type: Array,
        label: "Search Index",
        // http://docs.aws.amazon.com/AWSECommerceService/latest/DG/LocaleUS.html
        // Books, KindleStore, Movies, UnboxVideo, Music, MP3Downloads, Software, MobileApps
    },
    "searchIndex.$": {
        type: String,
        label: "Search Index",
    },
	title: {
        type: String,
        label: "Title"
    },
	authorFirstName: {
        type: String,
        label: "Author First Name",
        optional: true
    },
    authorLastName: {
        type: String,
        label: "Author Last Name",
        optional: true
    },
	directorFirstName: {
        type: String,
        label: "Director First Name",
        optional: true
    },
    directorLastName: {
        type: String,
        label: "Director Last Name",
        optional: true
    },
	artistFirstName: {
        type: String,
        label: "Artist First Name",
        optional: true
    },
    artistLastName: {
        type: String,
        label: "Artist Last Name",
        optional: true
    },
	availability: {
        type: String,
        label: "Availability",
        allowedValues: ['own', 'borrowed', 'need', 'returned'],
    },
    publisher: {
        type: String,
        label: "Publisher",
        optional: true
    },
    publicationDate: {
        type: Date,
        label: "Publication Date",
        optional: true
    },
    publicationYear: {
        type: Number,
        label: "Publication Year",
        optional: true
    },
	link: {
        type: String,
        label: "Link",
        optional: true
    },
    description: {
        type: String,
        label: "Description",
        optional: true
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

Resources.attachSchema(ResourcesSchema);