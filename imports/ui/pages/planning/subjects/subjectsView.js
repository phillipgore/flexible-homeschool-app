import {Template} from 'meteor/templating';
import { Subjects } from '../../../../api/subjects/subjects.js';
import { Students } from '../../../../api/students/students.js';
import { Resources } from '../../../../api/resources/resources.js';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Weeks } from '../../../../api/weeks/weeks.js';
import { Lessons } from '../../../../api/lessons/lessons.js';
import './subjectsView.html';

Template.subjectsView.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		this.subjectData = Meteor.subscribe('subjectView', FlowRouter.getParam('selectedSubjectId'));
	});
});

Template.subjectsView.onRendered( function() {
	Session.set({
		toolbarType: 'subject',
		editUrl: '/planning/subjects/edit/3/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedSubjectId'),
		labelThree: 'Subject',
		activeNav: 'planningList',
	});
});

Template.subjectsView.helpers({
	subscriptionReady: function() {
		return Template.instance().subjectData.ready();
	},

	subject: function() {
		return Subjects.findOne({_id: FlowRouter.getParam('selectedSubjectId')});
	},

	resources: function(resourceIds) {
		return Resources.find({_id: {$in: resourceIds}});
	},
});

Template.subjectsView.events({
	
});





