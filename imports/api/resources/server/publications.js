import {Resources} from '../resources.js';

Meteor.publish('allResources', function() {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Resources.find({groupId: groupId}, {sort: {title: 1}});
});

Meteor.publish('resource', function(resourceId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Resources.find({groupId: groupId, _id: resourceId});
});

Meteor.publish( 'searchResources', function( search ) {


	if ( search ) {
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let regex = new RegExp( search, 'i' );

		let query = {groupId: groupId, $or: [ { title: regex }, { author: regex }, { artist: regex }, { director: regex } ]};
		let projection = { limit: 100, sort: { title: 1 } };

		return Resources.find( query, projection );
	}

	
	return this.ready();
});