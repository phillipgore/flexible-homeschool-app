import {Template} from 'meteor/templating';
import './resetSent.html';

Template.resetSent.onCreated( function() {
	DocHead.setTitle('Reset Sent');
});