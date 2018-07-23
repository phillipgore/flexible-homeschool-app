import {Template} from 'meteor/templating';
import { Students } from '../../../api/students/students.js';
import { SchoolYears } from '../../../api/schoolYears/schoolYears.js';
import { Resources } from '../../../api/resources/resources.js';
import { Subjects } from '../../../api/subjects/subjects.js';
import { Terms } from '../../../api/terms/terms.js';
import { Weeks } from '../../../api/weeks/weeks.js';
import { Lessons } from '../../../api/lessons/lessons.js';

import moment from 'moment';
import autosize from 'autosize';
import './trackingView.html';

Template.trackingView.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		// Subscriptions
		this.studentData = Meteor.subscribe('student', FlowRouter.getParam('selectedStudentId'));
		this.subjectData = Meteor.subscribe('studentWeekSubjects', FlowRouter.getParam('selectedStudentId'), FlowRouter.getParam('selectedWeekId'));
		this.lessonData = Meteor.subscribe('studentWeekLessons', FlowRouter.getParam('selectedStudentId'), FlowRouter.getParam('selectedWeekId'));
	});

	Session.set({
		selectedStudentId: FlowRouter.getParam('selectedStudentId'),
		selectedSchoolYearId: FlowRouter.getParam('selectedSchoolYearId'),
		selectedTermId: FlowRouter.getParam('selectedTermId'),
		selectedWeekId: FlowRouter.getParam('selectedWeekId'),
		toolbarType: 'tracking',
		editUrl: '',
		newUrl: '',
	});
});

Template.trackingView.onRendered( function() {
	Session.set({
		activeNav: 'trackingList',
	});
});

Template.trackingView.helpers({
	subscriptionReady: function() {
		return Template.instance().studentData.ready();
	},

	student: function() {
		return Students.findOne({_id: FlowRouter.getParam('selectedStudentId')});
	},

	selectedSchoolYearId: function() {
		return FlowRouter.getParam('selectedSchoolYearId');
	},

	selectedSchoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')});
	},

	subjects: function() {
		return Subjects.find({studentId: FlowRouter.getParam('selectedStudentId'), schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}, {sort: {name: 1}});
	},

	subjectsOne: function(subjectsCount) {
		let subjectsLimit = Subjects.find({studentId: FlowRouter.getParam('selectedStudentId'), schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}).count() / 2;
		return Subjects.find({studentId: FlowRouter.getParam('selectedStudentId'), schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}, {sort: {name: 1}, limit: subjectsLimit});
	},

	subjectsTwo: function(subjectsCount) {
		let subjectsSkip = Subjects.find({studentId: FlowRouter.getParam('selectedStudentId'), schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}).count() / 2;
		return Subjects.find({studentId: FlowRouter.getParam('selectedStudentId'), schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}, {sort: {name: 1}, skip: subjectsSkip});
	},

	studentName(first, last) {
		if (first && last) {
			Session.set({labelTwo: first + ' ' + last});
		}
		return false;
	},
});












