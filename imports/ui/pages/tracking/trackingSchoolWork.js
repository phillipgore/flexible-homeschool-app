import {Template} from 'meteor/templating';
import { Stats } from '../../../api/stats/stats.js';
import { SchoolYears } from '../../../api/schoolYears/schoolYears.js';
import { SchoolWork } from '../../../api/schoolWork/schoolWork.js';
import { Lessons } from '../../../api/lessons/lessons.js';
import { Terms } from '../../../api/terms/terms.js';
import { Weeks } from '../../../api/weeks/weeks.js';

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
		return Lessons.find({schoolWorkId: schoolWorkId});
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
});

Template.trackingSchoolWork.events({
	'click .js-show-schoolWork-info'(event) {
		event.preventDefault();

		$('.js-show').show();
		$('.js-hide').hide();
		$('.js-info').hide();
		Session.set('schoolWorkInfo', null);

		if ($(event.currentTarget).hasClass('js-closed')) {
			$(event.currentTarget).removeClass('js-closed');
			let schoolWorkId = $(event.currentTarget).attr('id');

			$('.js-schoolWork-track').removeClass('active');
			$('.js-lesson-input').removeAttr('style');

			$('.js-show.js-label-' + schoolWorkId).hide();
			$('.js-hide.js-label-' + schoolWorkId).show();
			$('.js-' + schoolWorkId).show();

			Meteor.call('getSchoolWorkInfo', schoolWorkId, function(error, result) {
				Session.set('schoolWorkInfo', result);

				$('.js-loader-' + schoolWorkId).hide();
				$('.js-info-' + schoolWorkId).show();
			})
		} else {
			$(event.currentTarget).addClass('js-closed');
		}		
	},

	'click .js-lesson-btn'(event) {
		event.preventDefault();

		$('.js-hide, .js-info').hide();
		$('.js-show').show();
		Session.set('schoolWorkInfo', null);

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
	},

	'click .js-close'(event) {
		event.preventDefault();

		$('.js-schoolWork-track').removeClass('active');
		$('.js-schoolWork-track').removeClass('inactive');
		$('.js-lesson-input').removeAttr('style');
		if ($(window).width() < 640) {
			$(window).scrollTop(Session.get('lessonScrollTop'));
		}
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

		// function statLessonsCompletedInc(lessonProperties) {
		// 	let lessonCurrentStatus = Lessons.findOne({_id: lessonProperties._id}).completed;

		// 	if (lessonCurrentStatus === lessonProperties.completed) {
		// 		return 0;
		// 	}
		// 	if (!lessonCurrentStatus && lessonProperties.completed) {
		// 		return 1
		// 	}
		// 	if (lessonCurrentStatus && !lessonProperties.completed) {
		// 		return -1;
		// 	}
		// };

		// function rounding(complete, total) {
		// 	if(complete && total) {
		// 		let percentComplete = complete / total * 100
		// 		if (percentComplete > 0 && percentComplete < 1) {
		// 			return 1;
		// 		}
		// 		return Math.floor(percentComplete);
		// 	}
		// 	return 0;
		// };

		// function statLessonsAssignedInc(lessonProperties) {
		// 	let lessonCurrentStatus = Lessons.findOne({_id: lessonProperties._id});

		// 	if (lessonCurrentStatus.assigned === lessonProperties.assigned || lessonCurrentStatus.completed) {
		// 		return 0;
		// 	}
		// 	if (!lessonCurrentStatus.assigned && lessonProperties.assigned) {
		// 		return 1
		// 	}
		// 	if (lessonCurrentStatus.assigned && !lessonProperties.assigned) {
		// 		return -1;
		// 	}
		// };

		// function status (lessonsTotal, lessonsCompletedTotal, lessonsAssignedTotal) {
		// 	if (!lessonsTotal) {
		// 		return 'empty'
		// 	}
		// 	if (!lessonsCompletedTotal && !lessonsAssignedTotal) {
		// 		return 'pending'
		// 	} 
		// 	if (lessonsTotal === lessonsCompletedTotal) {
		// 		return 'completed'
		// 	}
		// 	if (lessonsAssignedTotal) {
		// 		return 'assigned'
		// 	} 
		// 	return 'partial'
		// };

		// let statLessonsCompleted = statLessonsCompletedInc(lessonProperties);
		// let statLessonsAssigned = statLessonsAssignedInc(lessonProperties);

		// let schoolYearStats = Stats.findOne({studentId: FlowRouter.getParam('selectedStudentId'), timeFrameId: FlowRouter.getParam('selectedSchoolYearId'), type: 'schoolYear'});
		// let termStats = Stats.findOne({studentId: FlowRouter.getParam('selectedStudentId'), timeFrameId: FlowRouter.getParam('selectedTermId'), type: 'term'});
		// let weekStats = Stats.findOne({studentId: FlowRouter.getParam('selectedStudentId'), timeFrameId: FlowRouter.getParam('selectedWeekId'), type: 'week'});

		// let schoolYearCompletedLessonCount = schoolYearStats.completedLessonCount + statLessonsCompleted;
		// let schoolYearCompletedLessonPercentage = rounding(schoolYearCompletedLessonCount, schoolYearStats.lessonCount);
		// let schoolYearAssignedLessonCount = schoolYearStats.assignedLessonCount + statLessonsAssigned;
		// let schoolYearStatus = status(schoolYearStats.lessonCount, schoolYearCompletedLessonCount, schoolYearAssignedLessonCount);

		// let termCompletedLessonCount = termStats.completedLessonCount + statLessonsCompleted;
		// let termCompletedLessonPercentage = rounding(termCompletedLessonCount, termStats.lessonCount);
		// let termAssignedLessonCount = termStats.assignedLessonCount + statLessonsAssigned;
		// let termStatus = status(termStats.lessonCount, termCompletedLessonCount, termAssignedLessonCount);

		// let weekCompletedLessonCount = weekStats.completedLessonCount + statLessonsCompleted;
		// let weekCompletedLessonPercentage = rounding(weekCompletedLessonCount, weekStats.lessonCount);
		// let weekAssignedLessonCount = weekStats.assignedLessonCount + statLessonsAssigned;
		// let weekStatus = status(weekStats.lessonCount, weekCompletedLessonCount, weekAssignedLessonCount);
		
		// let statProperties =  [
		// 	{
		// 		_id: schoolYearStats._id,
		// 		completedLessonCount: schoolYearCompletedLessonCount,
		// 		completedLessonPercentage: schoolYearCompletedLessonPercentage,
		// 		assignedLessonCount: schoolYearAssignedLessonCount,
		// 		status: schoolYearStatus,
		// 	},

		// 	{
		// 		_id: termStats._id,
		// 		completedLessonCount: termCompletedLessonCount,
		// 		completedLessonPercentage: termCompletedLessonPercentage,
		// 		assignedLessonCount: termAssignedLessonCount,
		// 		status: termStats,
		// 	},

		// 	{
		// 		_id: weekStats._id,
		// 		completedLessonCount: weekCompletedLessonCount,
		// 		completedLessonPercentage: weekCompletedLessonPercentage,
		// 		assignedLessonCount: weekAssignedLessonCount,
		// 		status: weekStatus,
		// 	},
		// ];

		Meteor.call('updateLesson', statProperties, pathProperties, lessonProperties, function(error, result) {
			if (error) {
				Alerts.insert({
					colorClass: 'bg-danger',
					iconClass: 'icn-danger',
					message: error.reason,
				});
				$('.js-lesson-updating').hide();
			} else {
				// $('.js-lesson-updating').hide();
			}
		});

		return false;
	},
});