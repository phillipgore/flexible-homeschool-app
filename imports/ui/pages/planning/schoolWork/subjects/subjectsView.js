import {Template} from 'meteor/templating';
import { Subjects } from '../../../../../api/subjects/subjects.js';

import './subjectsView.html';

Template.subjectsView.onCreated( function() {	
	let template = Template.instance();
	
	this.subjectData = Meteor.subscribe('subjectsView', FlowRouter.getParam('selectedSubjectId'));
});

Template.subjectsView.onRendered( function() {
	Session.set({
		toolbarType: 'subject',
		editUrl: '/planning/subjects/edit/3/' + Session.get('selectedStudentIdType') +'/'+ getSelectedId() +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedSubjectId'),
		labelThree: 'Subject',
		activeNav: 'planningList',
	});
});

Template.subjectsView.helpers({
	subjectSubscriptionReady: function() {
		return Template.instance().subjectData.ready();
	},
	
	subject: function() {
		return Subjects.findOne({_id: FlowRouter.getParam('selectedSubjectId')}, {sort: {name: 1}});
	},
});

const getSelectedId = () => {
	if (Session.get('selectedStudentIdType') === 'students') {
		return Session.get('selectedStudentId');
	}
	return Session.get('selectedStudentGroupId');
}