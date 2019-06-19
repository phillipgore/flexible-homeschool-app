import {Template} from 'meteor/templating';
import { Stats } from '../../../api/stats/stats.js';
import { SchoolYears } from '../../../api/schoolYears/schoolYears.js';
import { SchoolWork } from '../../../api/schoolWork/schoolWork.js';
import { Lessons } from '../../../api/lessons/lessons.js';
import { Terms } from '../../../api/terms/terms.js';
import { Weeks } from '../../../api/weeks/weeks.js';
import { Notes } from '../../../api/notes/notes.js';

import moment from 'moment';
import _ from 'lodash'

import './trackingSchoolWork.html';

Template.trackingSchoolWork.helpers({
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

	workLessons: function(schoolWorkId) {
		return Lessons.find({schoolWorkId: schoolWorkId}, {sort: {order: 1}});
	},

	lessonCount: function(schoolWorkId) {
		return Lessons.find({schoolWorkId: schoolWorkId}).count();
	},

	lessonPosition: function(schoolWorkId, lessonId) {
		let lessonIds = Lessons.find({schoolWorkId: schoolWorkId}).map(lesson => (lesson._id))
		return lessonIds.indexOf(lessonId);
	},

	todaysDate: function() {
		return moment();
	},

	workInfo: function() {
		return Session.get('schoolWorkInfo');
	},

	lessonInfo: function() {
		return Session.get('lessonInfo');
	},

	lessonStatus: function(lesson, schoolWorkId) {
		$('.js-lesson-updating').hide();
		let lessons = Lessons.find({schoolWorkId: schoolWorkId}).fetch();

		if (!_.some(lessons, ['completed', false])) {
			return 'btn-primary';
		}
		if (lesson.completed) {
			return 'btn-secondary';
		}
		if (lesson.assigned) {
			return 'btn-warning';
		}

		return false;
	},

	hasNote: function(schoolWorkId) {
		let note = Notes.findOne({schoolWorkId: schoolWorkId}).note && Notes.findOne({schoolWorkId: schoolWorkId}).note
		if (note.length) {
			return true;
		}
		return false;
	},

	workNote: function() {
		return Session.get('schoolWorkNote');
	},

	editorContentReady: function() {
		return Session.get('editorContentReady');
	}
});

Template.trackingSchoolWork.events({
	'click .js-show-schoolWork-notes'(event) {
		event.preventDefault();

		$('.js-info, .js-notes').hide()
		$('.js-info').removeClass('js-open');
		Session.set({
			'schoolWorkNote': null,
			'editorContentReady': false,
		});

		let schoolWorkId = $(event.currentTarget).attr('id');

		if ($('.js-notes-' + schoolWorkId).hasClass('js-open')) {
			$('.js-notes-' + schoolWorkId).removeClass('js-open')
		} else {
			$('.js-notes').removeClass('js-open');

			$('.js-schoolWork-track').removeClass('active');
			$('.js-lesson-input').removeAttr('style');
			$('.js-notes-' + schoolWorkId).show().addClass('js-open');

			Meteor.call('getNoteInfo', FlowRouter.getParam('selectedWeekId'), schoolWorkId, function(error, result) {
				if (_.isUndefined(result)) {
					Session.set({
						'editorContentReady': true,
						'schoolWorkNote': null,
					});
				} else {
					Session.set({
						'editorContentReady': true,
						'schoolWorkNote': result.note,
					});
				}
			});
		}		
	},

	'keyup .js-notes-editor': function(event) {
		let instance = Template.instance();
		let schoolWorkId = $(event.currentTarget).parentsUntil('.js-notes').parent().attr('data-work-id');
		console.log(schoolWorkId)

		if (instance.debounce) {
			Meteor.clearTimeout(instance.debounce);
		}

		instance.debounce = Meteor.setTimeout(function() {
			$('.js-notes-loader-' + schoolWorkId).show();
			let user = Meteor.user();
			let noteProperties = {
				userId: user._id,
				groupId: user.info.groupId,
				weekId: FlowRouter.getParam('selectedWeekId'),
				schoolWorkId: schoolWorkId,
				note: $(event.currentTarget).html().trim(),
			}

			Meteor.call('upsertNotes', noteProperties, function(error, result) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'icn-danger',
						message: error.reason,
					});
				} else {
					$('.js-notes-loader-' + schoolWorkId).hide();
				}
			})
		}, 500);
	},

	'click .js-show-schoolWork-info'(event) {
		event.preventDefault();

		$('.js-info, .js-notes').hide()
		$('.js-notes').removeClass('js-open');
		Session.set('schoolWorkInfo', {description: '', resources: []});
		
		let schoolWorkId = $(event.currentTarget).attr('id');
		$('.js-info-data-' + schoolWorkId).hide();
		$('.js-info-loader-' + schoolWorkId).show();

		if ($('.js-info-' + schoolWorkId).hasClass('js-open')) {
			$('.js-info-' + schoolWorkId).removeClass('js-open')
		} else {
			$('.js-info').removeClass('js-open');

			$('.js-schoolWork-track').removeClass('active');
			$('.js-lesson-input').removeAttr('style');
			$('.js-info-' + schoolWorkId).show().addClass('js-open');

			Meteor.call('getSchoolWorkInfo', schoolWorkId, function(error, result) {
				Session.set('schoolWorkInfo', result);

				$('.js-info-loader-' + schoolWorkId).hide();
				$('.js-info-data-' + schoolWorkId).show();
			})
		}		
	},

	'click .js-lesson-btn'(event) {
		event.preventDefault();

		if ($(window).width() < 640) {
			$('.navbar').hide();
		}
		$('.js-info, .js-notes').hide();
		$('.js-show-schoolWork-info, .js-show-schoolWork-notes').addClass('js-closed');

		Session.set('schoolWorkInfo', {description: '', resources: []});
		Session.set('lessonInfo', null);

		let schoolWorkId = $(event.currentTarget).attr('data-schoolWork-id');
		let lessonId = $(event.currentTarget).attr('data-lesson-id');
		Session.set('lessonScrollTop', $('#js-schoolWork-track-' + schoolWorkId).offset().top - 80);

		$('.js-lesson-input').removeAttr('style');
		$('#js-schoolWork-track-' + schoolWorkId).addClass('active');
		$('.js-schoolWork-track').not('.active').addClass('inactive');

		$('#' + lessonId).show();
		$(window).scrollTop(0);

		$('#completed-on-' + lessonId).pickadate({
			format: 'mmmm d, yyyy',
			today: 'Today',
			clear: 'Clear',
			close: 'Close',
		});

		Meteor.call('getLesson', lessonId, function(error, result) {
			Session.set('lessonInfo', result);

			$('.js-loader-' + lessonId).hide();
			$('.js-info-' + lessonId).show();
		});
	},

	'click .js-close'(event) {
		event.preventDefault();

		$('.navbar').show();
		$('.js-schoolWork-track').removeClass('active');
		$('.js-schoolWork-track').removeClass('inactive');
		$('.js-lesson-input').removeAttr('style');
		if ($(window).width() < 640) {
			$(window).scrollTop(Session.get('lessonScrollTop'));
		}
		Session.set('lessonInfo', null);
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

		$('.navbar').show();
		$('.js-schoolWork-track').removeClass('active');
		$('.js-schoolWork-track').removeClass('inactive');
		$('.js-lesson-input').removeAttr('style');
		if ($(window).width() < 640) {
			$(window).scrollTop(Session.get('lessonScrollTop'));
		}

		let lessonProperties = {
			_id: $(event.currentTarget).parent().attr('id'),
			assigned: event.currentTarget.assigned.value.trim() === 'true',
			completed: event.currentTarget.completed.value.trim() === 'true',
			completedOn: event.currentTarget.completedOn.value.trim(),
			completionTime: event.currentTarget.completionTime.value.trim(),
			description: $('#' + $(event.currentTarget).find('.editor-content').attr('id')).html(),
		}

		if (_.has(lessonProperties, 'completedOn')) {
			lessonProperties.completedOn = moment(lessonProperties.completedOn).toISOString();
		}

		let pathProperties = {
			studentIds: [FlowRouter.getParam('selectedStudentId')],
			schoolYearIds: [FlowRouter.getParam('selectedSchoolYearId')],
			termIds: [FlowRouter.getParam('selectedTermId')],
		}

		let statProperties = {
			studentIds: [FlowRouter.getParam('selectedStudentId')],
			schoolYearIds: [FlowRouter.getParam('selectedSchoolYearId')],
			termIds:[FlowRouter.getParam('selectedTermId')],
			weekIds:[FlowRouter.getParam('selectedWeekId')],
		}

		Meteor.call('updateLesson', statProperties, pathProperties, lessonProperties, function(error, result) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
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