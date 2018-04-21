import {Resources} from '../resources.js';

// Meteor.publish('allResources', function() {
// 	if (!this.userId) {
// 		return this.ready();
// 	}

// 	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
// 	return Resources.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {title: 1}});
// });

Meteor.publish('scopedResources', function(type, availability) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;

	if (type === 'all' && availability === "all") {
		return Resources.find({groupId: groupId, deletedOn: { $exists: false }}, {sort: {title: 1}});
	} else if (type != 'all' && availability != "all") {
		return Resources.find({groupId: groupId, deletedOn: { $exists: false }, type: type, availability: availability}, {sort: {title: 1}});
	} else if (type === 'all' && availability != "all") {
		return Resources.find({groupId: groupId, deletedOn: { $exists: false }, availability: availability}, {sort: {title: 1}});
	} else if (type != 'all' && availability === "all") {
		return Resources.find({groupId: groupId, deletedOn: { $exists: false }, type: type}, {sort: {title: 1}});
	}
});

Meteor.publish('resource', function(resourceId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Resources.find({groupId: groupId, deletedOn: { $exists: false }, _id: resourceId});
});

Meteor.publish('searchResources', function( search ) {	
	if ( search ) {
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let regex = new RegExp( search, 'i' );

		let query = {groupId: groupId, deletedOn: { $exists: false }, $or: [ { title: regex }, { author: regex }, { artist: regex }, { director: regex } ]};
		let projection = { limit: 100, sort: { title: 1 } };

		return Resources.find( query, projection );
	}
	return this.ready();
});