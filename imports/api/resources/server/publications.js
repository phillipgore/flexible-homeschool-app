import {Resources} from '../resources.js';

import _ from 'lodash'

Meteor.publish('scopedResources', function(type, availability) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;

	if (type === 'all' && availability === "all") {
		return Resources.find({groupId: groupId}, {sort: {title: 1}, fields: {title: 1, type: 1, availability: 1}});
	} else if (type != 'all' && availability != "all") {
		return Resources.find({groupId: groupId, type: type, availability: availability}, {sort: {title: 1}, fields: {title: 1, type: 1, availability: 1}});
	} else if (type === 'all' && availability != "all") {
		return Resources.find({groupId: groupId, availability: availability}, {sort: {title: 1}, fields: {title: 1, type: 1, availability: 1}});
	} else if (type != 'all' && availability === "all") {
		return Resources.find({groupId: groupId, type: type}, {sort: {title: 1}, fields: {title: 1, type: 1, availability: 1}});
	}
});

Meteor.publish('resource', function(resourceId) {
	if (!this.userId) {
		return this.ready();
	}

	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
	return Resources.find({groupId: groupId, _id: resourceId}, {fields: {groupId: 0, userId: 0, createdOn: 0, updatedOn: 0}});
});

Meteor.publish('scopedSearchResources', function( type, availability, search, limit ) {
	let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;	
	if ( search ) {
		let regex = new RegExp( search, 'i' );
		let projection = { limit: 25, sort: { title: 1 }, fields: {title: 1, type: 1, availability: 1} };

		if (type === 'all' && availability === "all") {
			let query = {groupId: groupId, $or: [ { title: regex }, { author: regex }, { artist: regex }, { director: regex } ]};
			return Resources.find( query, projection );
		} else if (type != 'all' && availability != "all") {
			let query = {groupId: groupId, type: type, availability: availability, $or: [ { title: regex }, { author: regex }, { artist: regex }, { director: regex } ]};
			return Resources.find( query, projection );
		} else if (type === 'all' && availability != "all") {
			let query = {groupId: groupId, availability: availability, $or: [ { title: regex }, { author: regex }, { artist: regex }, { director: regex } ]};
			return Resources.find( query, projection );
		} else if (type != 'all' && availability === "all") {
			let query = {groupId: groupId, type: type, $or: [ { title: regex }, { author: regex }, { artist: regex }, { director: regex } ]};
			return Resources.find( query, projection );
		}
	}
	
	if (type === 'all' && availability === "all") {
		return Resources.find({groupId: groupId}, {limit: limit, sort: {title: 1}, fields: {title: 1, type: 1, availability: 1}});
	} else if (type != 'all' && availability != "all") {
		return Resources.find({groupId: groupId, type: type, availability: availability}, {limit: limit, sort: {title: 1}, fields: {title: 1, type: 1, availability: 1}});
	} else if (type === 'all' && availability != "all") {
		return Resources.find({groupId: groupId, availability: availability}, {limit: limit, sort: {title: 1}, fields: {title: 1, type: 1, availability: 1}});
	} else if (type != 'all' && availability === "all") {
		return Resources.find({groupId: groupId, type: type}, {limit: limit, sort: {title: 1}, fields: {title: 1, type: 1, availability: 1}});
	}
});

Meteor.publish('searchResources', function( search ) {	
	if ( search ) {
		let groupId = Meteor.users.findOne({_id: this.userId}).info.groupId;
		let regex = new RegExp( search, 'i' );

		let query = {groupId: groupId, $or: [ { title: regex }, { author: regex }, { artist: regex }, { director: regex } ]};
		let projection = { limit: 25, sort: { title: 1 }, fields: {title: 1, type: 1} };

		return Resources.find( query, projection );
	}
	return this.ready();
});