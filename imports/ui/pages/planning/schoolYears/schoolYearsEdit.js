import {Template} from 'meteor/templating';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Subjects } from '../../../../api/subjects/subjects.js';
import { Weeks } from '../../../../api/weeks/weeks.js';
import { Lessons } from '../../../../api/lessons/lessons.js';
import {yearValidation} from '../../../../modules/functions';
import './schoolYearsEdit.html';

LocalTerms = new Mongo.Collection(null);

Template.schoolYearsEdit.onCreated( function() {
	let template = Template.instance();

	template.autorun( () => {
		template.subscribe('schoolYearComplete', FlowRouter.getParam('selectedSchoolYearId'), () => {
			LocalTerms.remove({});
			let termCount = 1;
			Terms.find().forEach(function(term) {
				LocalTerms.insert({id: term._id, order: term.order, delete: false});
				termCount++
			});
		    LocalTerms.insert({order: termCount, delete: false});
	    })
	})
});

Template.schoolYearsEdit.onRendered( function() {
	// Toolbar Settings
	Session.set({
		toolbarType: 'edit',
		labelThree: 'Edit School Year',
		selectedFramePosition: 3,
		selectedFrameClass: 'frame-position-three',
		activeNav: 'planningList',
	});
})

Template.schoolYearsEdit.helpers({
	schoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')});
	},

	terms: function() {
		return Terms.find();
	},

	termDeletable: function(termId) {
		let weekIds = [];
		Weeks.find({termId: termId}).forEach((week) => {
			weekIds.push(week._id)
		});
		let lessons = Lessons.find({weekId: {$in: weekIds}}).count();
		let lessonsDeletable = Lessons.find({
			weekId: {$in: weekIds},
			$and: [{
				completedOn: null,
			    completionTime: null,
			    description: null,
			}]
		}).count();

		if (lessons === lessonsDeletable) {
			return true;
		}
		return false;
	},

	lessonUndeletableCount(termId) {
		let weekIds = [];
		Weeks.find({termId: termId}).forEach((week) => {
			weekIds.push(week._id)
		});
		let lessons = Lessons.find({weekId: {$in: weekIds}}).count();
		let lessonsDeletable = Lessons.find({
			weekId: {$in: weekIds},
			$and: [{
				completedOn: null,
			    completionTime: null,
			    description: null,
			}]
		}).count();

		return lessons - lessonsDeletable;
	},

	weeks: function() {
		return Weeks.find();
	},

	termWeekCount: function(termId) {
		if (termId) {
			return Weeks.find({termId: termId}).count();
		}
		return '';
	},

	localTerms: function() {
		return LocalTerms.find({delete: false});
	},

	indexIncrement: function(index) {
		return index + 1;
	},

	cancelPath: function() {
		return '/planning/schoolyears/view/' + FlowRouter.getParam('selectedSchoolYearId');
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

		let localTermCount = LocalTerms.find({delete: false}).count();
		if (valueCount.length === localTermCount) {
			LocalTerms.insert({order: localTermCount + 1, delete: false});
		}

		let termId = $(event.target).parentsUntil('.js-term-input').parent().attr('id');
		let newWeekCount = $(event.target).val();

		let weekIds = [];
		Weeks.find({termId: termId}).forEach((week) => {
			weekIds.push(week._id)
		});

		let lessonCount = []
		Subjects.find().forEach((subject) => {
			let count = Lessons.find({subjectId: subject._id, weekId: {$in: weekIds}}).count()
			lessonCount.push(count);
		});

		let minLessonCount = Math.max(...lessonCount);
		let lessonDist = Math.ceil(minLessonCount / 7)
		
		if (lessonDist > newWeekCount) {
			$('#' + termId).find('.js-weeks-per-term').addClass('error');
			$('#' + termId).find('.js-weeks-per-term-errors').text('At least ' + lessonDist + ' weeks are required for existing lessons.').show();
		} else {
			$('#' + termId).find('.js-weeks-per-term').removeClass('error');
			$('#' + termId).find('.js-weeks-per-term-errors').text('');
		}
	},

	'click .js-term-delete-disabled'(event) {
		event.preventDefault();

		let overLessons = event.currentTarget.id;

		function plural(overLessons) {
			if (overLessons === '1') {
				return"lesson";
			}
			return "lessons";
		}

		Alerts.insert({
			colorClass: 'bg-danger',
			iconClass: 'fss-danger',
			message: "You may not delete this term. It would remove " + overLessons + " " + plural(overLessons) + " you have already worked on.",
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

	'blur .js-start-year'(event) {
		event.preventDefault();

		if (yearValidation(event.target.value.trim())) {
			$('.js-start-year').removeClass('error');
			$('.js-start-year-errors').text('');
		} else {
			$('.js-start-year').addClass('error');
			$('.js-start-year-errors').text('Must be a valid 4 digit year.').show();
		}
	},

	'submit .js-form-school-year-edit'(event) {
		event.preventDefault();

		if (yearValidation(event.target.startYear.value.trim())) {
			$('.js-start-year').removeClass('error');
			$('.js-start-year-errors').text('');
		} else {
			$('.js-start-year').addClass('error');
			$('.js-start-year-errors').text('Must be a valid 4 digit year.').show();
		}

		let termId = $(event.target).parentsUntil('.js-term-input').parent().attr('id');
		let newWeekCount = $(event.target).val();

		let weekIds = [];
		Weeks.find({termId: termId}).forEach((week) => {
			weekIds.push(week._id)
		});

		let lessonCount = []
		Subjects.find().forEach((subject) => {
			let count = Lessons.find({subjectId: subject._id, weekId: {$in: weekIds}}).count()
			lessonCount.push(count);
		});

		let minLessonCount = Math.max(...lessonCount);
		let lessonDist = Math.ceil(minLessonCount / 7)
		
		if (lessonDist > newWeekCount) {
			$('#' + termId).find('.js-weeks-per-term').addClass('error');
			$('#' + termId).find('.js-weeks-per-term-errors').text('At least ' + lessonDist + ' weeks are required for existing lessons.').show();
		} else {
			$('#' + termId).find('.js-weeks-per-term').removeClass('error');
			$('#' + termId).find('.js-weeks-per-term-errors').text('');
		}

		if (yearValidation(event.target.startYear.value.trim()) || lessonDist > newWeekCount) {
			$('.js-updating').show();
			$('.js-submit').prop('disabled', true);

			let schoolYearProperties = {
				startYear: event.target.startYear.value.trim(),
				endYear: event.target.endYear.value.trim(),
			}

			let termDeleteIds = [];
			LocalTerms.find({delete: true}).forEach((term) => {
				termDeleteIds.push(term.id);
			});

			let weekDeleteIds = [];
			Weeks.find({termId: {$in: termDeleteIds}}).forEach((week) => {
				weekDeleteIds.push(week._id)
			});

			let lessonDeleteIds = [];
			Lessons.find({weekId: {$in: weekDeleteIds}}).forEach((lesson) => {
				lessonDeleteIds.push(lesson._id)
			});

			let termUpdateProperties = [];
			let termInsertProperties = [];
			let weekInsertProperties = [];
			let lessonUpdateProperties = [];

			$(event.target).find('.js-term-input').each(function(index) {
				let termId = $(this).attr('id');
				let currentWeeks = Weeks.find({termId: termId});
				let currentWeekIds = currentWeeks.map(week => (week._id));
				let currentWeekCount = currentWeeks.count();
				let newWeekCount = $(this).find('.js-weeks-per-term').val();
				let weeksDif = newWeekCount - currentWeekCount;

				if (termId && newWeekCount) {
					if (weeksDif > -1) {
						for (i = 0; i < weeksDif; i++) {
							weekInsertProperties.push({
								termId: termId, 
								order: currentWeekCount + 1 + i,
							})
						}
					} else {
						let weekMoreDeleteIds = Weeks.find({termId: termId}, {limit: Math.abs(weeksDif), sort: {order: -1}}).map(week => (week._id));
						for (i = 0; i < weekMoreDeleteIds.length; i++) {
							weekDeleteIds.push(weekMoreDeleteIds[i]);
						}
						Subjects.find().forEach((subject) => {
							let lessonIds = Lessons.find({subjectId: subject._id, weekId: {$in: currentWeekIds}}).map(lesson => (lesson._id));
							let lessonsPerWeek = Math.ceil(lessonIds.length / newWeekCount);
							
							currentWeekIds.forEach((weekId, index) => {
								let startSlice = index * lessonsPerWeek;
								let endSlice = startSlice + lessonsPerWeek;
								let lesssonSlice = lessonIds.slice(startSlice, endSlice)
								lesssonSlice.forEach((lessonId) => {
									lessonUpdateProperties.push({_id: lessonId, weekId: weekId});
								})
							});
						});
					}
					termUpdateProperties.push({_id: termId, order: index +1});
				} else if (newWeekCount) {
					termInsertProperties.push({order: index +1, weeksPerTerm: newWeekCount});
				}
			});

			Meteor.call('updateSchoolYear', FlowRouter.getParam('selectedSchoolYearId'), schoolYearProperties, function(error) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: error.reason,
					});
					
					$('.js-updating').hide();
					$('.js-submit').prop('disabled', false);
					return false;
				}
			});

			if (lessonDeleteIds.length) {
				Meteor.call('batchRemoveLessons', lessonDeleteIds, function(error) {
					if (error) {
						Alerts.insert({
							colorClass: 'bg-danger',
							iconClass: 'fss-danger',
							message: error.reason,
						});
						
						$('.js-updating').hide();
						$('.js-submit').prop('disabled', false);
						return false;
					}
				});
			}

			if (weekDeleteIds.length) {
				Meteor.call('batchRemoveWeeks', weekDeleteIds, function(error) {
					if (error) {
						Alerts.insert({
							colorClass: 'bg-danger',
							iconClass: 'fss-danger',
							message: error.reason,
						});
						
						$('.js-updating').hide();
						$('.js-submit').prop('disabled', false);
						return false;
					}
				});
			}

			if (termDeleteIds.length) {
				Meteor.call('batchRemoveTerms', termDeleteIds, function(error) {
					if (error) {
						Alerts.insert({
							colorClass: 'bg-danger',
							iconClass: 'fss-danger',
							message: error.reason,
						});
						
						$('.js-updating').hide();
						$('.js-submit').prop('disabled', false);
						return false;
					}
				});
			}

			if (termUpdateProperties.length) {
				Meteor.call('batchUpdateTerms', termUpdateProperties, function(error) {
					if (error) {
						Alerts.insert({
							colorClass: 'bg-danger',
							iconClass: 'fss-danger',
							message: error.reason,
						});
						
						$('.js-updating').hide();
						$('.js-submit').prop('disabled', false);
						return false;
					}
				});
			}

			if (lessonUpdateProperties.length) {
				Meteor.call('batchUpdateLessons', lessonUpdateProperties, function(error) {
					if (error) {
						Alerts.insert({
							colorClass: 'bg-danger',
							iconClass: 'fss-danger',
							message: error.reason,
						});
						
						$('.js-updating').hide();
						$('.js-submit').prop('disabled', false);
						return false;
					}
				});
			}

			if (weekInsertProperties.length) {
				Meteor.call('batchInsertWeeks', weekInsertProperties, function(error) {
					if (error) {
						Alerts.insert({
							colorClass: 'bg-danger',
							iconClass: 'fss-danger',
							message: error.reason,
						});

						$('.js-updating').hide();
						$('.js-submit').prop('disabled', false);
						return false;
					}
				});
			}

			if (termInsertProperties.length) {
				termInsertProperties.forEach(function(term) {
					const weeksPerTerm = term.weeksPerTerm;
					term.schoolYearId = FlowRouter.getParam('selectedSchoolYearId');
					delete term.weeksPerTerm;

					Meteor.call('insertTerm', term, function(error, termId) {
						if (error) {
							Alerts.insert({
								colorClass: 'bg-danger',
								iconClass: 'fss-danger',
								message: error.reason,
							});
				
							$('.js-updating').hide();
							$('.js-submit').prop('disabled', false);
							return false;
						} else {
							let newWeekInsertProperties = []							
							for (i = 0; i < parseInt(weeksPerTerm); i++) { 
							    newWeekInsertProperties.push({order: i + 1, termId: termId});
							}

							Meteor.call('batchInsertWeeks', newWeekInsertProperties, function(error) {
								if (error) {
									Alerts.insert({
										colorClass: 'bg-danger',
										iconClass: 'fss-danger',
										message: error.reason,
									});
				
									$('.js-updating').hide();
									$('.js-submit').prop('disabled', false);
									return false;
								}
							});
						}
					});
				});
			}

			$('.js-updating').hide();
			$('.js-submit').prop('disabled', false);
			FlowRouter.go('/planning/schoolyears/view/' + FlowRouter.getParam('selectedSchoolYearId'));
		}

		return false;
	}


});









