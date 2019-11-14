import {Template} from 'meteor/templating';
import './supportList.html';

Template.supportList.onCreated( function() {

});

Template.supportList.onRendered( function() {
	Session.set({
		toolbarType: 'support',
		labelTwo: 'Support',
		activeNav: 'settingsList',
	});
});