import {Template} from 'meteor/templating';
import './verifySent.html';

Template.verifySent.onCreated( function() {
	DocHead.setTitle('Verify Sent');
});