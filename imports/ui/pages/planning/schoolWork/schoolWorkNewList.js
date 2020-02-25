import {Template} from 'meteor/templating';
import './schoolWorkNewList.html';

Template.schoolWorkNewList.onCreated( function() {
	Session.setPersistent('unScrolled', true);
});