import {Template} from 'meteor/templating';
import { SchoolWork } from '../../../../api/schoolWork/schoolWork.js';
import { Students } from '../../../../api/students/students.js';
import './schoolWorkList.html';

Template.schoolWorkList.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		this.subscribe('studentSchoolYearsPath', FlowRouter.getParam('selectedStudentId'));
		this.subscribe('allStudents');
		this.schoolWorkData = this.subscribe('schooYearStudentSchoolWork', FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedStudentId'));
	});
	
	Session.set('selectedSchoolYearId', FlowRouter.getParam('selectedSchoolYearId'));
	Session.set('selectedStudentId', FlowRouter.getParam('selectedStudentId'));
});

Template.schoolWorkList.onRendered( function() {
	Session.set({
		labelTwo: 'School Work',
		newUrl: '/planning/schoolWork/new/3/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId'),
		activeNav: 'planningList',
	});
});

Template.schoolWorkList.helpers({
	subscriptionReady: function() {
		return Template.instance().schoolWorkData.ready();
	},

	schoolWorkCount: function() {
		return SchoolWork.find().count();
	},

	schoolWork: function() {
		return SchoolWork.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId'), studentId: FlowRouter.getParam('selectedStudentId')}, {sort: {name: 1}});
	},

	selectedStudentId: function() {
		return FlowRouter.getParam('selectedStudentId');
	},

	studentCount: function() {
		return Counts.get('studentCount');
	},

	selectedSchoolYearId: function() {
		return FlowRouter.getParam('selectedSchoolYearId');
	},

	schoolYearCount: function() {
		return Counts.get('schoolYearCount');
	},

	studentPlusSchoolYearCount: function() {
		return Counts.get('studentCount') + Counts.get('schoolYearCount');
	},

	activeRoute: function(currentRoute, route) {
		if (currentRoute === route) {
			return true;
		}
		return false;
	},

	active: function(id) {
		if (FlowRouter.getParam('selectedSchoolWorkId') === id) {
			return true;
		}
		return false;
	},
});

Template.schoolWorkList.events({
	
});