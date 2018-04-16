import {Template} from 'meteor/templating';
import { Students } from '../../../api/students/students.js';
import { Subjects } from '../../../api/subjects/subjects.js';
import { Terms } from '../../../api/terms/terms.js';
import { Weeks } from '../../../api/weeks/weeks.js';
import { Lessons } from '../../../api/lessons/lessons.js';

import moment from 'moment';
import autosize from 'autosize';
import './trackingView.html';

Template.trackingView.onCreated( function() {
	// Subscriptions
	this.subscribe('student', FlowRouter.getParam('id'));
	this.subscribe('studentWeekSubjects', FlowRouter.getParam('id'), FlowRouter.getParam('selectedWeekId'));
	this.subscribe('studentWeekLessons', FlowRouter.getParam('id'), FlowRouter.getParam('selectedWeekId'));

	// Subbar Subscriptions
	this.subscribe('schoolYearsSubbar', FlowRouter.getParam('id'));
	this.subscribe('termsSubbar', FlowRouter.getParam('id'), FlowRouter.getParam('selectedSchoolYearId'));
	this.subscribe('weeksSubbar', FlowRouter.getParam('id'), FlowRouter.getParam('selectedSchoolYearId'), FlowRouter.getParam('selectedTermId'));

	Session.set('selectedSchoolYearId', FlowRouter.getParam('selectedSchoolYearId'));
	Session.set('selectedTermId', FlowRouter.getParam('selectedTermId'));
	Session.set('selectedWeekId', FlowRouter.getParam('selectedWeekId'));

	Tracker.autorun(function() {
		Session.get('selectedSchoolYear');
		Session.get('selectedTerm');
		Session.get('selectedWeek');

		$('.js-subject').removeClass('active');
		$('.js-lesson-input').removeAttr('style');
	});
});

Template.trackingView.onRendered( function() {
	// ToolbarView Settings
	Session.set({
		leftUrl: '/tracking/list/' + FlowRouter.getParam('selectedSchoolYearId') +"/"+ Session.get('selectedTermId'),
		leftIcon: 'fss-back',
		label: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'trackingList');
});

Template.trackingView.helpers({
	student: function() {
		return Students.findOne({_id: FlowRouter.getParam('id')});
	},

	selectedSchoolYearId: function() {
		return FlowRouter.getParam('selectedSchoolYearId');
	},

	subjects: function() {
		return Subjects.find();
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

	lessonStatus: function(lessonCompleted, subjectId) {
		let lessonsIncompleteCount = Lessons.find({weekId: FlowRouter.getParam('selectedWeekId'), subjectId: subjectId, completed: false}, {sort: {order: 1}}).count()
		if (!lessonsIncompleteCount) {
			return 'btn-primary';
		}
		if (lessonCompleted) {
			return 'btn-secondary';
		}
		return false;
	},
});

Template.trackingView.events({
	'click .js-lesson-btn'(event) {
		event.preventDefault();

		let lessonId = $(event.currentTarget).attr('data-lesson-id');

		autosize($('#description-' + lessonId));
		autosize.update($('#description-' + lessonId));
		$('.js-lesson-input').removeAttr('style');
		$(event.currentTarget).parentsUntil('.js-subject').parent().addClass('active');
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
		$('.js-subject').removeClass('active');
		$('.js-lesson-input').removeAttr('style');
	},

	'change .js-completed-checkbox'(event) {
	    if ($(event.currentTarget).val() === 'true') {
	    	$(event.currentTarget).val('false');
	    } else {
	    	$(event.currentTarget).val('true');
	    }
	},

	'submit .js-form-lessons-update'(event) {
		event.preventDefault();

		$('.js-loading').show();
		$('.js-submit').prop('disabled', true);

		let lessonId = $(event.currentTarget).parent().attr('id');
		let lessonPoperties = {
			completed: event.currentTarget.completed.value.trim() === 'true',
			completedOn: event.currentTarget.completedOn.value.trim(),
			completionTime: event.currentTarget.completionTime.value.trim(),
			description: event.currentTarget.description.value.trim(),
		}

		Meteor.call('updateLesson', lessonId, lessonPoperties, function(error) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'fss-danger',
					message: error.reason,
				});
				
				$('.js-loading').hide();
				$('.js-submit').prop('disabled', false);
			} else {
				$('.js-subject').removeClass('active');
				$('.js-lesson-input').removeAttr('style');
				$('.js-loading').hide();
				$('.js-submit').prop('disabled', false);
			}
		});

		return false;
	},
});












