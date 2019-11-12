import {Template} from 'meteor/templating';
import './verifySuccess.html';

Template.verifySuccess.onCreated( function() {
	DocHead.setTitle('Verify Success');
});