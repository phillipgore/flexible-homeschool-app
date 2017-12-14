import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Resources = new Mongo.Collection('resources');

if ( Meteor.isServer ) {
    Resources._ensureIndex({ title: 1, author: 1, artist: 1, director: 1, director: 1, description: 1 });
}

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
	author: {
        type: String,
        label: "Author",
        optional: true
    },
	director: {
        type: String,
        label: "Director",
        optional: true
    },
	artist: {
        type: String,
        label: "Artist",
        optional: true
    },
	availability: {
        type: String,
        label: "Availability",
        allowedValues: ['own', 'library', 'need'],
        optional: true
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

Resources.attachSchema(ResourcesSchema);