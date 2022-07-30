import {Template} from 'meteor/templating';
import './studentGroupsEach.html';

Template.studentGroupsEach.onCreated( function() {

});

Template.studentGroupsEach.onRendered( function() {
	
});

Template.studentGroupsEach.helpers({
	active: function(id) {
		if (FlowRouter.getParam('selectedStudentGroupId') === id) {
			return true;
		}
		return false;
	},
});