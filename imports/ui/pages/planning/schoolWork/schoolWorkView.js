import {Template} from 'meteor/templating';
import { SchoolWork } from '../../../../api/schoolWork/schoolWork.js';
import { Students } from '../../../../api/students/students.js';
import { Resources } from '../../../../api/resources/resources.js';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Weeks } from '../../../../api/weeks/weeks.js';
import { Lessons } from '../../../../api/lessons/lessons.js';
import './schoolWorkView.html';

Template.schoolWorkView.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		this.schoolWorkData = Meteor.subscribe('schoolWorkView', FlowRouter.getParam('selectedSchoolWorkId'));
		this.weekData = Meteor.subscribe('schoolYearWeeks', FlowRouter.getParam('selectedSchoolYearId'));
	});
});

Template.schoolWorkView.onRendered( function() {
	Session.set({
		toolbarType: 'schoolWork',
		editUrl: '/planning/schoolWork/edit/3/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedSchoolWorkId'),
		labelThree: 'School Work',
		activeNav: 'planningList',
	});
});

Template.schoolWorkView.helpers({
	subscriptionReady: function() {
		return Template.instance().schoolWorkData.ready();
	},

	schoolWork: function() {
		return SchoolWork.findOne({_id: FlowRouter.getParam('selectedSchoolWorkId')});
	},

	resources: function(resourceIds) {
		return Resources.find({_id: {$in: resourceIds}});
	},
});

Template.schoolWorkView.events({
	
});





