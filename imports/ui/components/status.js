import {Template} from 'meteor/templating';

import './status.html';
import _ from 'lodash';
import moment from 'moment';

Template.status.helpers({
	status: function () {
		return JSON.stringify(Meteor.status())
	},

	connected: function () {
		return Meteor.status().connected;
	},

	message: function () {
		return _.capitalize(Meteor.status().status);
	},

	connecting: function () {
		if (Meteor.status().status === 'connecting') {
			return true;
		}
		return false;
	},
});


Template.status.events({
	'click .js-reconnect': function (event) {
		event.preventDefault()
		Meteor.reconnect()
	}
})