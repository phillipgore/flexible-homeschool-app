import {Template} from 'meteor/templating';
import './verifySuccess.html';

Template.verifySuccess.onRendered( function() {
	analytics.page();
});