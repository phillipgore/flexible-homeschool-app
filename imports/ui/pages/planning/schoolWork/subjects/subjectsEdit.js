import {Template} from 'meteor/templating';
import { Subjects } from '../../../../../api/subjects/subjects.js';

import './subjectsEdit.html';

Template.subjectsEdit.onCreated( function() {	
	let template = Template.instance();
	
	template.autorun(() => {
		this.subjectData = Meteor.subscribe('subject', FlowRouter.getParam('selectedSubjectId'));
	});
});


Template.subjectsEdit.helpers({
	subject: function() {
		return Subjects.findOne({_id: FlowRouter.getParam('selectedSubjectId')});
	},
});

Template.subjectsEdit.events({
	'click .js-cancel'(event) {
		event.preventDefault();

		if (window.screen.availWidth > 768) {
			FlowRouter.go('/planning/subjects/view/3/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedSubjectId'));
		} else {
			FlowRouter.go('/planning/subjects/view/2/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedSubjectId'));
		}
	},
});