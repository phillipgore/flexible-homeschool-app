import {Template} from 'meteor/templating';
import './toolbarLarge.html';

Template.toolbarLarge.helpers({
	backButton: function() {
		if (Session.get('selectedFramePosition') === 1 || Session.get('selectedFramePosition') === 2) {
			return false;
		}
		return true;
	},
})