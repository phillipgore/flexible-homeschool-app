import {Template} from 'meteor/templating';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../../api/terms/terms.js';
import { SchoolWork } from '../../../../api/schoolWork/schoolWork.js';
import { Weeks } from '../../../../api/weeks/weeks.js';
import { Lessons } from '../../../../api/lessons/lessons.js';
import {yearValidation} from '../../../../modules/functions';
import './schoolYearsEdit.html';

import _ from 'lodash'
LocalTerms = new Mongo.Collection(null);

Template.schoolYearsEdit.onCreated( function() {
	let template = Template.instance();

	template.autorun( () => {
		template.subscribe('schoolYearEdit', FlowRouter.getParam('selectedSchoolYearId'), () => {
			LocalTerms.remove({});
			Terms.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}).forEach(function(term) {
				LocalTerms.insert({id: term._id, isNew: false, order: term.order, origOrder: term.order, weeksPerTerm: term.weeksPerTerm, origWeeksPerTerm: term.weeksPerTerm, lessonCount: term.lessonCount, minLessonCount: term.minLessonCount, isDeletable: term.isDeletable, undeletableLessonCount: term.undeletableLessonCount, delete: false});
			});
			let order = LocalTerms.find({delete: false}).count() + 1;
		    LocalTerms.insert({id: Random.id(), isNew: true, order: order, lessonCount: 0, minLessonCount: 0, isDeletable: true, undeletableLessonCount: 0, delete: false});
	    })
	})
});

Template.schoolYearsEdit.onRendered( function() {
	// Toolbar Settings
	Session.set({
		toolbarType: 'edit',
		labelThree: 'Edit School Year',
		activeNav: 'planningList',
	});
})

Template.schoolYearsEdit.helpers({
	schoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')});
	},

	terms: function() {
		return Terms.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId')});
	},

	localTerms: function() {
		return LocalTerms.find({delete: false});
	},

	indexIncrement: function(index) {
		return index + 1;
	},

	cancelPath: function() {
		return '/planning/schoolyears/view/3/' + FlowRouter.getParam('selectedSchoolYearId');
	},
});

Template.schoolYearsEdit.events({
	'keyup .js-weeks-per-term'(event) {
		let valueCount = [];
		let totalWeeks = 0
		$('.js-term-inputs').find('.js-weeks-per-term').each(function() {
			if ($(this).val()) {
				valueCount.push($(this).val());
				totalWeeks = totalWeeks + parseInt($(this).val());
			}
		});

		$('.js-total').html(totalWeeks);
		if ( totalWeeks > 52 && !Alerts.find({type: 'terms'}).count() ) {
			Alerts.insert({
				type: 'terms',
				colorClass: 'bg-warning',
				iconClass: 'fss-warning',
				message: "You have exceeded 52 weeks.",
			});
		}

		if (totalWeeks < 53) {
			Alerts.remove({});
		}

		let termId = $(event.target).parentsUntil('.js-term-input').parent().attr('id');
		let newWeekCount = $(event.target).val();

		let localTermCount = LocalTerms.find({delete: false}).count();
		if (valueCount.length === localTermCount) {
			LocalTerms.insert({id: Random.id(), isNew: true, order: localTermCount + 1, lessonCount: 0, minLessonCount: 0, isDeletable: true, undeletableLessonCount: 0, delete: false});
		}

		let minLessonCount = LocalTerms.findOne({id: termId}).minLessonCount;
		let requiredNumberOfWeeks = Math.ceil(minLessonCount / 7);
		
		if (requiredNumberOfWeeks > newWeekCount) {
			$('#' + termId).find('.js-weeks-per-term').addClass('error');
			$('#' + termId).find('.js-weeks-per-term-errors').text('At least ' + requiredNumberOfWeeks + ' weeks are required for existing lessons.').show();
			$('.js-submit').prop('disabled', true);
		} else {
			let value = parseInt($('#' + termId).find('.js-weeks-per-term').val())
			if (isNaN(value) && LocalTerms.findOne({id: termId}).isNew === false || value <= 0 && LocalTerms.findOne({id: termId}).isNew === false) {
				$('#' + termId).find('.js-weeks-per-term').addClass('error');
				$('#' + termId).find('.js-weeks-per-term-errors').text('Must have at least one week.').show();
				$('.js-submit').prop('disabled', true);
			} else if (_.isNumber(value) && value <= 0 && LocalTerms.findOne({id: termId}).isNew === true) {
				$('#' + termId).find('.js-weeks-per-term').addClass('error');
				$('#' + termId).find('.js-weeks-per-term-errors').text('Must have at least one week.').show();
				$('.js-submit').prop('disabled', true);
			} else {
				$('#' + termId).find('.js-weeks-per-term').removeClass('error');
				$('#' + termId).find('.js-weeks-per-term-errors').text('');
				$('.js-submit').prop('disabled', false);
			}
		}
	},

	'click .js-term-delete-disabled'(event) {
		event.preventDefault();

		let overTimes = event.currentTarget.id;

		function plural(overLessons) {
			if (overLessons === '1') {
				return"time";
			}
			return "times";
		}

		Alerts.insert({
			colorClass: 'bg-danger',
			iconClass: 'fss-danger',
			message: "You may not delete this term. It would remove " + overTimes + " " + plural(overTimes) + " you have already worked on it.",
		});
	},

	'click .js-term-delete'(event) {
		event.preventDefault();

		let localTermId = event.currentTarget.id		
		if (localTermId === $('.js-term-input:last .js-term-delete').attr('id')) {
			$('.js-term-input:last .js-weeks-per-term').val('');
		} else {
			LocalTerms.update(localTermId, {$set: {delete: true}});
		}

		let totalWeeks = 0
		$('.js-term-inputs').find('.js-weeks-per-term').each(function() {
			if ($(this).val()) {
				totalWeeks = totalWeeks + parseInt($(this).val());
			}
		});
		$('.js-total').html(totalWeeks);
	},

	'keyup .js-start-year'(event) {
		event.preventDefault();

		if (yearValidation(event.target.value.trim())) {
			$('.js-start-year').removeClass('error');
			$('.js-start-year-errors').text('');
			$('.js-submit').prop('disabled', false);
		} else {
			$('.js-start-year').addClass('error');
			$('.js-start-year-errors').text('Must be a 4 digit year.').show();
			$('.js-submit').prop('disabled', true);
		}
	},

	'keyup .js-end-year'(event) {
		event.preventDefault();

		if (yearValidation(event.target.value.trim())) {
			$('.js-end-year').removeClass('error');
			$('.js-end-year-errors').text('');
			$('.js-submit').prop('disabled', false);
		} else {
			$('.js-end-year').addClass('error');
			$('.js-end-year-errors').text('Must be a 4 digit year.').show();
			$('.js-submit').prop('disabled', true);
		}
	},

	'submit .js-form-school-year-edit'(event) {
		event.preventDefault();

		$('.js-updating').show();
		$('.js-submit').prop('disabled', true);

		// Get new School Year Properties from Form
		let schoolYearProperties = {
			startYear: event.target.startYear.value.trim(),
			endYear: event.target.endYear.value.trim(),
		}

		LocalTerms.find().forEach(term => {
			let order = $('#' + term.id + ' .js-term-order').val();
			let weeksPerTerm = $('#' + term.id + ' .js-weeks-per-term').val();
			LocalTerms.update(term._id, {$set: {order: order, weeksPerTerm: weeksPerTerm}})
		});


		let termDeleteIds = [];
		let termInsertProperties = [];
		let termUpdateProperties = [];

		LocalTerms.find().forEach((term) => {
			if (!term.isNew && term.delete) {
				termDeleteIds.push(term.id)
			} else if (term.isNew && term.weeksPerTerm) {
				termInsertProperties.push({order: term.order, weeksPerTerm: term.weeksPerTerm, schoolYearId: FlowRouter.getParam('selectedSchoolYearId')})
			} else if (!term.isNew) {
				if (term.order != term.origOrder || term.weeksPerTerm != term.origWeeksPerTerm) {
					termUpdateProperties.push({_id: term.id, order: term.order, weeksPerTerm: term.weeksPerTerm, origWeeksPerTerm: term.origWeeksPerTerm})
				}
			}
		});

		if (termDeleteIds.length || termInsertProperties.length || termUpdateProperties.length) {
			Alerts.insert({
				colorClass: 'bg-info',
				iconClass: 'fss-info',
				message: "Please be patient. This could take a bit.",
			});

			Meteor.call('updateSchoolYearTerms', FlowRouter.getParam('selectedSchoolYearId'), schoolYearProperties, termDeleteIds, termInsertProperties, termUpdateProperties, function(error) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: error.reason,
					});
					
					$('.js-updating').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					$('.js-updating').hide();
					$('.js-submit').prop('disabled', false);
					FlowRouter.go('/planning/schoolyears/view/3/' + FlowRouter.getParam('selectedSchoolYearId'));

				}
			});
		} else {
			Meteor.call('updateSchoolYear', FlowRouter.getParam('selectedSchoolYearId'), schoolYearProperties, function(error) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: error.reason,
					});
					
					$('.js-updating').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					$('.js-updating').hide();
					$('.js-submit').prop('disabled', false);
					FlowRouter.go('/planning/schoolyears/view/3/' + FlowRouter.getParam('selectedSchoolYearId'));

				}
			});
		}
		
		return false;
	},


});









