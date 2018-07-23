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

	resources: function(resourceIds) {
		return Resources.find({_id: {$in: resourceIds}});
	},

	terms: function() {
		return Terms.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}, {sort: {order: 1}});
	},

	selectedTerm: function() {
		return Terms.findOne({_id: FlowRouter.getParam('selectedTermId')});
	},

	weeks: function() {
		return Weeks.find({termId: FlowRouter.getParam('selectedTermId')}, {sort: {order: 1}});
	},

	selectedWeek: function() {
		return Weeks.findOne({_id: FlowRouter.getParam('selectedWeekId')});
	},

	lessons: function(subjectId) {
		return Lessons.find({weekId: FlowRouter.getParam('selectedWeekId'), subjectId: subjectId}, {sort: {order: 1}});
	},

	lessonCount: function(subjectId) {
		return Lessons.find({weekId: FlowRouter.getParam('selectedWeekId'), subjectId: subjectId}).count();
	},

	lessonPosition: function(subjectId, lessonId) {
		let lessonIds = Lessons.find({weekId: FlowRouter.getParam('selectedWeekId'), subjectId: subjectId}, {sort: {order: 1}}).map(lesson => (lesson._id))
		return Lessons.find() && lessonIds.indexOf(lessonId);
	},

	todaysDate: function() {
		return moment();
	},

	lessonStatus: function(lessonAssigned, lessonCompleted, subjectId) {
		let lessonsIncompleteCount = Lessons.find({weekId: FlowRouter.getParam('selectedWeekId'), subjectId: subjectId, completed: false}, {sort: {order: 1}}).count()
		if (!lessonsIncompleteCount && lessonCompleted) {
			return 'btn-primary';
		}
		if (lessonCompleted) {
			return 'btn-secondary';
		}
		if (lessonAssigned) {
			return 'btn-warning';
		}
		return '';
	},

	studentName(first, last) {
		if (first && last) {
			Session.set({labelTwo: first + ' ' + last});
		}
		return false;
	},
});

Template.trackingView.events({
	'click .js-show-subject-info'(event) {
		event.preventDefault();

		$('.js-subject-track').removeClass('active');
		$('.js-lesson-input').removeAttr('style');
		
		let subjectId = $(event.currentTarget).attr('id');
		$('.js-label-' + subjectId).toggle();
		$('.js-' + subjectId).slideToggle('fast');
	},

	'click .js-lesson-btn'(event) {
		event.preventDefault();
		
		$('.js-hide, .js-info').hide();
		$('.js-show').show();

		let lessonId = $(event.currentTarget).attr('data-lesson-id');
		autosize($('#description-' + lessonId));
		autosize.update($('#description-' + lessonId));
		$('.js-lesson-input').removeAttr('style');
		$(event.currentTarget).parentsUntil('.js-subject-track').parent().addClass('active');
		$('#' + lessonId).show();
		$('#completed-on-' + lessonId).pickadate({
			format: 'mmmm d, yyyy',
			today: 'Today',
			clear: 'Clear',
			close: 'Close',
		});
	},

	'click .js-close'(event) {
		event.preventDefault();
		$('.js-subject-track').removeClass('active');
		$('.js-lesson-input').removeAttr('style');
	},

	'change .js-completed-checkbox, change .js-assigned-checkbox'(event) {
	    if ($(event.currentTarget).val() === 'true') {
	    	$(event.currentTarget).val('false');
	    } else {
	    	$(event.currentTarget).val('true');
	    }
	},

	'submit .js-form-lessons-update'(event) {
		event.preventDefault();

		let lessonId = $(event.currentTarget).parent().attr('id');
		$('[data-lesson-id="' + lessonId + '"]').find('.js-lesson-updating').show();
		$('.js-subject-track').removeClass('active');
		$('.js-lesson-input').removeAttr('style');

		let lessonPoperties = {
			_id: $(event.currentTarget).parent().attr('id'),
			assigned: event.currentTarget.assigned.value.trim() === 'true',
			completed: event.currentTarget.completed.value.trim() === 'true',
			completedOn: event.currentTarget.completedOn.value.trim(),
			completionTime: event.currentTarget.completionTime.value.trim(),
			description: event.currentTarget.description.value.trim(),
		}

		Meteor.call('updateLesson', lessonPoperties, function(error, result) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
				
				$('.js-lesson-updating').hide();
			} else {
				$('.js-lesson-updating').hide();
			}
		});

		return false;
	},
});












