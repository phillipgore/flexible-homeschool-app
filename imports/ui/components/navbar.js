import {Template} from 'meteor/templating';
import {Groups} from '../../api/groups/groups.js';
import './navbar.html';

Template.navbar.helpers({
	active(nav) {
		if (Session.get('activeNav') ===  nav) {
			return 'active';
		}
		return;
	},

	group: function() {
		return Groups.findOne({});
	},
});