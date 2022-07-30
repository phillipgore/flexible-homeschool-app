import {Template} from 'meteor/templating';
import { Groups } from '../../../../api/groups/groups.js';
import { SchoolWork } from '../../../../api/schoolWork/schoolWork.js';
import { Subjects } from '../../../../api/subjects/subjects.js';
import { Students } from '../../../../api/students/students.js';
import './schoolWorkList.html';

SchooWorkList = new Mongo.Collection('schooWorkList');

const getSelectedId = () => {
	if (Session.get('selectedStudentIdType') === 'students') {
		return Session.get('selectedStudentId');
	}
	return Session.get('selectedStudentGroupId');
}

Template.schoolWorkList.onCreated( function() {
	let template = Template.instance();
	
	template.autorun(() => {
		this.subjectData = Meteor.subscribe('schooYearStudentSubject', FlowRouter.getParam('selectedSchoolYearId'), Session.get('selectedStudentIdType'), getSelectedId());
		this.schoolWorkData = Meteor.subscribe('schooYearStudentSchoolWork', FlowRouter.getParam('selectedSchoolYearId'), Session.get('selectedStudentIdType'), getSelectedId());
		this.schoolWorkStats = Meteor.subscribe('schoolWorkStats');
	});
});

Template.schoolWorkList.onRendered( function() {
	Session.set({
		labelTwo: 'School Work',
		newUrl: '/planning/work/new/3/' + Session.get('selectedStudentIdType') +'/'+ getSelectedId()  +'/'+ FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId'),
		activeNav: 'planningList',
	});
});

Template.schoolWorkList.helpers({
	subscriptionReady: function() {
		if (Template.instance().schoolWorkData.ready() && Template.instance().subjectData.ready() && Template.instance().schoolWorkStats.ready()) {
			if (FlowRouter.getParam('selectedSchoolWorkId') != 'empty') {
				let selectedSchoolWork = SchoolWork.findOne({_id: FlowRouter.getParam('selectedSchoolWorkId')});
				if (selectedSchoolWork && selectedSchoolWork.subjectId) {
					let subject = '#' + selectedSchoolWork.subjectId + ' .js-subject-toggle';
					let listClass = '.js-' + selectedSchoolWork.subjectId;
					
					$(subject).addClass('js-open');
					$(subject).find('.js-caret-right').hide();
					$(subject).find('.js-caret-down').show();
					$(listClass).show();
				}
			}
			
			return true;
		}
	},

	schooWorkList: function() {
		let getSubjects = () => {
			if (Session.get('selectedStudentIdType') === 'students') {
				return Subjects.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId'), studentId: FlowRouter.getParam('selectedStudentId')}).fetch();
			}
			return Subjects.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId'), studentGroupId: FlowRouter.getParam('selectedStudentGroupId')}).fetch();
		}
		let subjects = getSubjects()
		subjects.forEach(subject => subject.type = 'subject');

		let getWorkItems = () => {
			if (Session.get('selectedStudentIdType') === 'students') {
				return SchoolWork.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId'), studentId: FlowRouter.getParam('selectedStudentId'), subjectId: {$exists: false}}).fetch();
			}
			return SchoolWork.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId'), studentGroupId: FlowRouter.getParam('selectedStudentGroupId'), subjectId: {$exists: false}}).fetch();
		}
		let workItems = getWorkItems()
		workItems.forEach(workItem => workItem.type = 'work');

		return _.sortBy(subjects.concat(workItems), ['name']);
	},

	studentsSchoolYearsCount: function() {
		let initialIds = Groups.findOne({_id: Meteor.user().info.groupId}).initialIds && Groups.findOne({_id: Meteor.user().info.groupId}).initialIds;
		if (initialIds.studentId != 'empty' && initialIds.schoolYearId != 'empty') {
			return true;
		}
		return false;
	},
});











