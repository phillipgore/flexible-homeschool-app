import {Template} from 'meteor/templating';
import { SchoolWork } from '../../../../api/schoolWork/schoolWork.js';
import { Students } from '../../../../api/students/students.js';
import { Resources } from '../../../../api/resources/resources.js';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Weeks } from '../../../../api/weeks/weeks.js';
import { Lessons } from '../../../../api/lessons/lessons.js';

import {requiredValidation} from '../../../../modules/functions';
import _ from 'lodash'
import './schoolWorkEdit.html';

LocalResources = new Mongo.Collection(null);

Template.schoolWorkEdit.onCreated( function() {
	// Subscriptions
	this.schoolWorkData = this.subscribe('schoolWork', FlowRouter.getParam('selectedSchoolWorkId'), function() {
		Session.set('schoolYearId', SchoolWork.findOne({_id: FlowRouter.getParam('selectedSchoolWorkId')}).schoolYearId)
	});
	this.studentData = this.subscribe('allStudents');
	this.schoolYearData = this.subscribe('allSchoolYears');
	this.termData = this.subscribe('allTerms');
	this.weekData = this.subscribe('allWeeks');
	this.lessonData = this.subscribe('schoolWorkLessons', FlowRouter.getParam('selectedSchoolWorkId'));

	let template = Template.instance();

	template.schoolWorkId = new ReactiveVar(FlowRouter.getParam('selectedSchoolWorkId'))
	template.searchQuery = new ReactiveVar();
	template.searching   = new ReactiveVar( false );

	template.autorun( () => {
		template.subscribe('schoolWorkResources', template.schoolWorkId.get(), () => {
	    	LocalResources.remove({});
			Resources.find().forEach(function(resource) {
				LocalResources.insert({id: resource._id, type: resource.type, title: resource.title});
			});
			template.schoolWorkId.set('');
	    })
	})

	template.autorun( () => {
		template.subscribe( 'searchResources', template.searchQuery.get(), () => {
		  setTimeout( () => {
		    template.searching.set( false );
		  }, 500 );
		});
	});
});

Template.schoolWorkEdit.onRendered( function() {
	let template = Template.instance();

	Session.set({
		toolbarType: 'edit',
		labelThree: 'Edit School Work',
		activeNav: 'planningList',
	});

	// Form Validation and Submission
	$('.js-form-school-work-update').validate({
		rules: {
			timesPerWeek: { number: true, max: 7 },
		},
		
		messages: {
			timesPerWeek: { number: "Number Required.", max: 'Limit 7.' },
		},

		submitHandler() {
			$('.js-updating').show();
			$('.js-submit').prop('disabled', true);

			// Get Resources Ids from local collection
			let resourceIds = [];
			LocalResources.find().forEach(function(resource) {
				resourceIds.push(resource.id);
			});

			// Get School Work Properties from form
			let updateSchoolWorkProperties = {
				_id: FlowRouter.getParam('selectedSchoolWorkId'),
				name: template.find("[name='name']").value.trim(),
				description: $('.js-form-school-work-update .editor-content').html(),
				resources: resourceIds,
				studentId: FlowRouter.getParam('selectedStudentId'),
				schoolYearId: FlowRouter.getParam('selectedSchoolYearId'),
			}


			let insertLessonProperties = [];
			let removeLessonIds = [];

			// Get Lesson Properties from form
			$("[name='timesPerWeek']").each(function(index) {
				let schoolYearId = FlowRouter.getParam('selectedSchoolYearId');
				let termId = this.dataset.termId;
				let weekId = this.dataset.weekId;
				let weekOrder = this.dataset.weekOrder;
				let totalLessons =  parseInt(this.dataset.lessonCount);
				let completeLessons = parseInt(this.dataset.lessonCompleteCount);
				let newLessonsTotal = parseInt(this.value) || 0;

				if (newLessonsTotal > totalLessons) {
					let addCount =  newLessonsTotal - totalLessons;
					for (i = 0; i < addCount; i++) { 
					    insertLessonProperties.push({
					    	order: i + 1 + parseInt(totalLessons),
					    	schoolWorkId: FlowRouter.getParam('selectedSchoolWorkId'),
					    	studentId: FlowRouter.getParam('selectedStudentId'),
					    	schoolYearId: FlowRouter.getParam('selectedSchoolYearId'),
					    	termId: this.dataset.termId,
					    	termOrder: parseInt(this.dataset.termOrder), 
					    	weekId: this.dataset.weekId,
					    	weekOrder: parseInt(this.dataset.weekOrder),
					    });
					}
				}
				if (newLessonsTotal < totalLessons && newLessonsTotal >= completeLessons) {
					let removalCount = totalLessons - newLessonsTotal;
					let removeableLessonsIds = Lessons.find({weekId: weekId, completed: false, schoolWorkId: FlowRouter.getParam('selectedSchoolWorkId')}, {sort: {order: -1}, limit: removalCount}).map(lesson => (lesson._id));

					removeableLessonsIds.forEach(lessonId => {
						removeLessonIds.push(lessonId);
					});
				}
				if (newLessonsTotal < completeLessons) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'icn-danger',
						message: "These changes would delete lessons you have already worked on.",
					});
					return false;
				}
			});

			let pathProperties = {
				studentIds: [FlowRouter.getParam('selectedStudentId')],
				schoolYearIds: [FlowRouter.getParam('selectedSchoolYearId')],
				termIds: Array.from(document.getElementsByClassName('js-times-per-week-container')).map(term => term.id),
			}

			Meteor.call('updateSchoolWork', pathProperties, updateSchoolWorkProperties, removeLessonIds, insertLessonProperties, function(error, result) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'icn-danger',
						message: error.reason.message,
					});
					
					$('.js-updating').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					$('.js-updating').hide();
					$('.js-submit').prop('disabled', false);
					FlowRouter.go('/planning/schoolWork/view/3/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedSchoolWorkId'));
				}
			});

			return false;
		}
	});
})

Template.schoolWorkEdit.helpers({
	subscriptionReady: function() {
		if (Template.instance().schoolWorkData.ready() && Template.instance().studentData.ready() && Template.instance().schoolYearData.ready() && Template.instance().termData.ready() && Template.instance().weekData.ready() && Template.instance().lessonData.ready()) {
			return true;
		}
	},
	
	selectedSchoolWork: function() {
		return SchoolWork.findOne({_id: FlowRouter.getParam('selectedSchoolWorkId')});
	},

	selectedStudent: function() {
		return Students.findOne({_id: FlowRouter.getParam('selectedStudentId')});
	},

	selectedSchoolYear: function() {
		return SchoolYears.findOne({_id: FlowRouter.getParam('selectedSchoolYearId')});
	},

	terms: function() {
		return Terms.find({schoolYearId: FlowRouter.getParam('selectedSchoolYearId')}, {sort: {order: 1}});
	},

	weeks: function(termId) {
        return Weeks.find({termId: termId});
	},

	weekCount: function(termId) {
        return Weeks.find({termId: termId}).count();
	},

	isSelected: function(termId, value) {
		let weekIds = Weeks.find({termId: termId}).map(week => (week._id));
		let lessonCounts = [];
		weekIds.forEach(function(weekId) {
			lessonCounts.push(Lessons.find({weekId: weekId, schoolWorkId: FlowRouter.getParam('selectedSchoolWorkId')}).count());
		})

		if (_.uniq(lessonCounts).length === 1) {
			if (value === lessonCounts[0]) {
				$('#' + termId + ' .js-option-random').remove();
				return 'selected';
			};
		}
		return null;
	},

	isRandom: function(termId) {
		let weekIds = Weeks.find({termId: termId}).map(week => (week._id));
		let lessonCounts = [];
		weekIds.forEach(function(weekId) {
			lessonCounts.push(Lessons.find({weekId: weekId, schoolWorkId: FlowRouter.getParam('selectedSchoolWorkId')}).count());
		})

		if (_.uniq(lessonCounts).length === 1) {
			return false;
		}
		return true;
	},

	lessonCount: function(weekId) {
        return Lessons.find({weekId: weekId, schoolWorkId: FlowRouter.getParam('selectedSchoolWorkId')}).count();
	},

	lessonCompleteCount: function(weekId) {
        return Lessons.find({weekId: weekId, completed: true, schoolWorkId: FlowRouter.getParam('selectedSchoolWorkId')}).count();
	},

	lessonIncompleteCount: function(weekId) {
        return Lessons.find({weekId: weekId, completed: false, schoolWorkId: FlowRouter.getParam('selectedSchoolWorkId')}).count();
	},

	searching() {
		return Template.instance().searching.get();
	},

	query() {
		return Template.instance().searchQuery.get();
	},

	resources() {
		let resources = Resources.find();
		if (resources) {
			return resources;
		}
	},

	localResources() {
		return LocalResources.find();
	},
});

Template.schoolWorkEdit.events({
	'change .js-school-year-id'(event) {
		Session.set({schoolYearId: event.currentTarget.value})
	},

	'change .js-times-per-week-preset'(event) {
		$(event.currentTarget).parentsUntil('.js-times-per-week-container').parent().find('.js-times-per-week').each(function() {
			let completeLessons = $(this).attr('data-lesson-complete-count');
			let newLessons = event.currentTarget.value;
			let termOrder = $(this).parentsUntil('.js-times-per-week-container').parent().attr('data-term-order')

			if (newLessons < completeLessons && completeLessons > 0) {
				$(this).addClass('error');
				$(this).parent().find('.js-times-per-week-errors').text('Min ' + completeLessons + '.').show();
				$('.js-submit').prop('disabled', true);
				$('.js-label-' + termOrder +'.js-label-show').hide();
				$('.js-label-' + termOrder +'.js-label-hide').show();
				$('.js-' + termOrder + '.js-weeks-input').slideDown('fast');
			} else {
				$(this).removeClass('error');
				$(this).parent().find('.js-times-per-week-errors').text('');
				$('.js-submit').prop('disabled', false);
			}
		})
		$('#' + event.currentTarget.dataset.termId).find('.js-times-per-week').val(event.currentTarget.value);
	},

	'change .js-times-per-week'(event) {
		$('#' + event.currentTarget.dataset.termId + ' .js-times-per-week-preset option').removeProp('selected');
		$('#' + event.currentTarget.dataset.termId + ' .js-times-per-week-preset option:disabled').prop('selected', true);
	},

	'keyup .js-times-per-week'(event) {
		let completeLessons = event.currentTarget.dataset.lessonCompleteCount;
		let newLessons = $(event.currentTarget).val();

		if (newLessons < completeLessons && completeLessons > 0) {
			$(event.currentTarget).addClass('error');
			$(event.currentTarget).parent().find('.js-times-per-week-errors').text('Min ' + completeLessons + '.').show();
			$('.js-submit').prop('disabled', true);
		} else {
			$(event.currentTarget).removeClass('error');
			$(event.currentTarget).parent().find('.js-times-per-week-errors').text('');
			$('.js-submit').prop('disabled', false);
		}

		let uniqValues = _.uniq(_.map(document.getElementById(event.currentTarget.dataset.termId).getElementsByClassName('js-times-per-week'), 'value'))
		let randomOption = document.getElementById(event.currentTarget.dataset.termId).getElementsByClassName('js-option-random').length
		
		if (uniqValues.length != 1 && !randomOption) {
			$('#' + event.currentTarget.dataset.termId + ' .js-times-per-week-preset option').removeProp('selected');
			$('#' + event.currentTarget.dataset.termId + ' .js-times-per-week-preset').prepend('<option class="js-option-random" disabled selected value>Random Segments Per Week</option>');
		} else if (uniqValues.length == 1) {
			$('#' + event.currentTarget.dataset.termId + ' .js-option-random').remove();
			if (!uniqValues[0]) {
				$('#' + event.currentTarget.dataset.termId + ' .js-times-per-week-preset option:first').prop('selected', true);
			} else {
				$('#' + event.currentTarget.dataset.termId + ' .js-times-per-week-preset option[value='+ uniqValues[0] +']').prop('selected', true);
			}
		}
	},

	'click .js-show-individual-weeks'(event) {
		event.preventDefault();
		let termOrder = $(event.currentTarget).attr('id');
		$('.js-label-' + termOrder).toggle();
		$('.js-' + termOrder).slideToggle('fast');
	},

	'click .js-remove-resource'(event) {
		event.preventDefault();

		Alerts.remove({type: 'addResource'});
		LocalResources.remove({id: event.currentTarget.id});
	},

	'keyup #search-resources'(event, template) {
		let value = event.currentTarget.value.trim();

		if ( value !== '' ) {
			template.searchQuery.set( value );
			template.searching.set( true );
		}

		if ( value === '' ) {
			template.searchQuery.set( value );
		}
	},

	'click .js-clear-search'(event, template) {
		event.preventDefault();

		Alerts.remove({type: 'addResource'});
		$('#search-resources').val('');
		template.searchQuery.set('');
		template.searching.set(false);
	},

	'click .js-add-resource'(event, template) {
		event.preventDefault();

		let resource = Resources.findOne({_id: event.currentTarget.id});
		let localResource = LocalResources.findOne({id: resource._id})
		if (localResource) {
			Alerts.insert({
				type: 'addResource',
				colorClass: 'bg-warning',
				iconClass: 'icn-warning',
				message: '"' +localResource.title + '" is already attached to this schoolWork.',
			});
		} else {
			LocalResources.insert({id: resource._id, type: resource.type, title: resource.title});

			Alerts.remove({type: 'addResource'});
			$('#search-resources').val('');
			template.searchQuery.set('');
			template.searching.set(false);
		}
	},

	'click .js-resource-btn'(event) {
		event.preventDefault();
		Session.set('selectedResourceNewType', event.currentTarget.id);
		Session.set('currentType', event.currentTarget.id);
		$('.js-resource-popover .js-resource-type').text(event.currentTarget.id);
		document.getElementsByClassName('js-resource-popover')[0].classList.remove('hide');
	},

	'click .js-close-resource-popover'(event) {
		event.preventDefault();

		document.getElementsByClassName('js-form-new-resource')[0].reset();
		document.getElementsByClassName('js-form-new-resource')[0].getElementsByClassName('editor-content')[0].innerHTML = '';
		if (Session.get('currentType') != 'link') {
			document.getElementsByClassName('js-form-new-resource')[0].getElementsByClassName('js-radio-own')[0].checked = true;
		}
		document.getElementsByClassName('popover-content')[0].scrollTop = 0;
		document.getElementsByClassName('js-resource-popover')[0].classList.add('hide');
	},

	'click .js-create-attach'(event) {
		event.preventDefault();
		$('.js-form-new-resource').submit();
	},

	'click .js-step-circle, click .js-step-btn'(event) {
		event.preventDefault();

		let template = Template.instance();
		let stepClass = $(event.currentTarget).attr('data-id');


		if (stepClass === 'js-step-one') {
			$('.js-step-circle').removeClass('bg-info');
			$('.js-circle-one').addClass('bg-info');

			$('.js-show').show();
			$('.js-hide').hide();
			$('.js-info').slideUp('fast');
			$('.js-show-help').removeClass('js-open').addClass('js-closed');

			$('.js-step').addClass('offpage');
			$('.' + stepClass).removeClass('offpage');
		}
		if (stepClass === 'js-step-two') {
			if ( requiredValidation($("[name='name']").val().trim()) ) {
				$('#name').removeClass('error');
				$('.name-errors').text('');

				$('.js-step-circle').removeClass('bg-info');
				$('.js-circle-two').addClass('bg-info');

				$('.js-show').show();
				$('.js-hide').hide();
				$('.js-info').slideUp('fast');
				$('.js-show-help').removeClass('js-open').addClass('js-closed');

				$('.js-step').addClass('offpage');
				$('.' + stepClass).removeClass('offpage');
			} else {
				$('#name').addClass('error');
				$('.name-errors').text('Required.');
			}
		}
		if (stepClass === 'js-step-three') {
			if ( requiredValidation($("[name='name']").val().trim()) ) {
				$('#name').removeClass('error');
				$('.name-errors').text('');

				$('.js-step-circle').removeClass('bg-info');
				$('.js-circle-three').addClass('bg-info');

				$('.js-show').show();
				$('.js-hide').hide();
				$('.js-info').slideUp('fast');
				$('.js-show-help').removeClass('js-open').addClass('js-closed');

				$('.js-step').addClass('offpage');
				$('.' + stepClass).removeClass('offpage');
			} else {
				$('#name').addClass('error');
				$('.name-errors').text('Required.');
			}
		}
	},

	'submit .js-form-school-work-update'(event) {
		event.preventDefault();
	},

	'click .js-cancel'(event) {
		event.preventDefault();

		if (window.screen.availWidth > 768) {
			FlowRouter.go('/planning/schoolWork/view/3/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedSchoolWorkId'))
		} else {
			FlowRouter.go('/planning/schoolWork/view/2/' + FlowRouter.getParam('selectedStudentId') +'/'+ FlowRouter.getParam('selectedSchoolYearId') +'/'+ FlowRouter.getParam('selectedSchoolWorkId'))
		}

	},
});









