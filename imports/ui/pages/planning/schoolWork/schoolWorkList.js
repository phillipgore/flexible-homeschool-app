import {Template} from 'meteor/templating';
import { Groups } from '../../../../api/groups/groups.js';
import { SchoolWork } from '../../../../api/schoolWork/schoolWork.js';
import { Students } from '../../../../api/students/students.js';
import './schoolWorkList.html';

Template.schoolWorkList.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		this.schoolWorkStats = Meteor.subscribe('schoolWorkStats');
		this.schoolWorkData = Meteor.subscribe('schooYearStudentSchoolWork', FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedStudentId'));
	});
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
		if (Template.instance().schoolWorkStats.ready() && Template.instance().schoolWorkData.ready()) {
			return true;
		}
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

	studentsExist: function() {
		let initialIds = Groups.findOne({_id: Meteor.user().info.groupId}).initialIds;
		if (initialIds.studentId === 'empty') {
			return false;
		}
		return true;
	},

	selectedSchoolYearId: function() {
		return FlowRouter.getParam('selectedSchoolYearId');
	},

	schoolYearsExist: function() {
		let initialIds = Groups.findOne({_id: Meteor.user().info.groupId}).initialIds;
		if (initialIds.schoolYearId === 'empty') {
			return false;
		}
		return true;
	},

	activeRoute: function(currentRoute, route) {
		if (currentRoute === route) {
			return true;
		}
		return false;
	},

	studentsSchoolYearsCount: function() {
		let initialIds = Groups.findOne({_id: Meteor.user().info.groupId}).initialIds;
		if (initialIds.studentId != 'empty' && initialIds.schoolYearId != 'empty') {
			return true;
		}
		return false;
	},
});











