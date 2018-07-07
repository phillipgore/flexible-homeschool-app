import {Template} from 'meteor/templating';
import { Subjects } from '../../../../api/subjects/subjects.js';
import { Students } from '../../../../api/students/students.js';
import './subjectsList.html';

Template.subjectsList.onCreated( function() {
	var template = this;
	
	Tracker.autorun(() => {
		let routeName = FlowRouter.current().route.name;
		if (routeName === 'subjectsNew' || routeName === 'subjectsView' || routeName === 'subjectsEdit') {
			this.subscribe('studentSchoolYearsPath', FlowRouter.getParam('selectedStudentId'));
			this.subscribe('allStudents');
			this.subjectData = this.subscribe('schooYearStudentSubjects', FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedStudentId'));
		}
	});
	
	Session.set('selectedSchoolYearId', FlowRouter.getParam('selectedSchoolYearId'));
	Session.set('selectedStudentId', FlowRouter.getParam('selectedStudentId'));
});

Template.subjectsList.onRendered( function() {
	Session.set({
		labelTwo: 'Subjects',
		newUrl: '/planning/subjects/new/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId'),
		activeNav: 'planningList',
	});
});

Template.subjectsList.helpers({
	subscriptionReady: function() {
		return Template.instance().subjectData.ready();
	},

	subjectsCount: function() {
		return Subjects.find().count();
	},

	subjects: function() {
		return Subjects.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId'), studentId: FlowRouter.getParam('selectedStudentId')}, {sort: {order: 1}});
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
		if (FlowRouter.getParam('selectedSubjectId') === id) {
			return true;
		}
		return false;
	},
});

Template.subjectsList.events({
	
});