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
		editUrl: '/planning/subjects/edit/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedSubjectId'),
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
	'click .js-delete-subject-confirmed'(event) {
		event.preventDefault();
		$('.loading-deleting').show();

		function nextSubjectId(selectedSubjectId) {
			let subjectIds = Subjects.find({}, {sort: {order: 1}}).map(subject => (subject._id));
			let selectedIndex = subjectIds.indexOf(selectedSubjectId);

			if (selectedIndex) {
				return subjectIds[selectedIndex - 1]
			}
			return subjectIds[selectedIndex + 1]
		};

		let newSubjectId = nextSubjectId(FlowRouter.getParam('selectedSubjectId'));
		let dialogId = Dialogs.findOne()._id;

		Dialogs.remove({_id: dialogId});
		Meteor.call('deleteSubject', FlowRouter.getParam('selectedSubjectId'), function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
			} else {
				Session.set('selectedSubjectId', newSubjectId);
				FlowRouter.go('/planning/subjects/view/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ newSubjectId);
				$('.loading-deleting').hide();
			}
		});
	}
});





