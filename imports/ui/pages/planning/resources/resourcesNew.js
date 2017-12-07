import {Template} from 'meteor/templating';
import './resourcesNew.html';
import './resourcesFormBook.js';
import './resourcesFormLink.js';
import './resourcesFormVideo.js';
import './resourcesFormAudio.js';
import './resourcesFormApp.js';

Template.resourcesNew.onRendered( function() {
	// Form Settings
	Session.set({resourceType: 'book'})

	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		leftCaret: false,
		label: 'New Resource',
		rightUrl: '',
		rightIcon: '',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');
});

Template.resourcesNew.helpers({
	resourceTypeCheck: function(type) {
		return type === Session.get('resourceType');
	}
});

Template.resourcesNew.events({
	'click .js-radio-type'(event) {
		Session.set({resourceType: event.currentTarget.value})
	},
});