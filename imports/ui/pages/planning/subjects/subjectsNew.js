import {Template} from 'meteor/templating';
import { Students } from '../../../../api/students/students.js';
import { Resources } from '../../../../api/resources/resources.js';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Weeks } from '../../../../api/weeks/weeks.js';
import './subjectsNew.html';

LocalResources = new Mongo.Collection(null);

Template.subjectsNew.onCreated( function() {
	// Subscriptions
	this.studentData = this.subscribe('allStudents');
	this.schoolYearData = this.subscribe('allSchoolYears');
	this.termData = this.subscribe('allTerms');
	this.weekData = this.subscribe('allWeeks');

	let template = Template.instance();

	template.searchQuery = new ReactiveVar();
	template.searching   = new ReactiveVar( false );

	template.autorun( () => {
		template.subscribe( 'searchResources', template.searchQuery.get(), () => {
		  setTimeout( () => {
		    template.searching.set( false );
		  }, 500 );
		});
	});
});

Template.subjectsNew.onRendered( function() {
	// Resources Input Settings
	LocalResources.remove({});

	// School Year Id Settings
	Session.set({schoolYearId: ''})

	Session.set({
		toolbarType: 'new',
		labelThree: 'New Subject',
		selectedFramePosition: 3,
		selectedFrameClass: 'frame-position-three',
		activeNav: 'planningList',
	});

	// Form Validation and Submission
	$('.js-form-subjects-new').validate({
		rules: {
			name: { required: true },
			timesPerWeek: { number: true },
		},
		messages: {
			name: { required: "Required." },
			timesPerWeek: { number: "" },
		},
		errorPlacement: function(error, element) {
			var placement = $(element).data('error');
			if (placement) {
				$(element).parent().addClass('error');
				$(placement).append(error)
			} else {
				error.insertAfter(element);
			}
		},

		submitHandler() {
			$('.js-loading').show();
			$('.js-submit').prop('disabled', true);

			let studentIds = []
			event.target.studentId.forEach(function(student) {
				if (student.value.trim() === 'true') {
					studentIds.push(student.id)
				}
			});

			let resourceIds = [];
			LocalResources.find().forEach(function(resource) {
				resourceIds.push(resource.id);
			});

			const subjectProperties = {
				name: event.target.name.value.trim(),
				description: event.target.description.value.trim(),
				resources: resourceIds,
				schoolYearId: event.target.schoolYearId.value.trim(),
			};

			let lessonProperties = []
			event.target.timesPerWeek.forEach(function(times, index) {
				for (i = 0; i < parseInt(times.value); i++) { 
				    lessonProperties.push({order: parseFloat((index + 1) + '.' + (i + 1)), weekId: times.dataset.weekId});
				}
			});

			Meteor.call('batchInsertSubject', studentIds, subjectProperties, lessonProperties, function(error, newSubjects) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: error.reason,
					});
					
					$('.js-loading').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					Session.set('selectedStudentId', newSubjects[0].studentId);
					Session.set('selectedSubjectId', newSubjects[0].subjectId);
					let additionalStudentsCount = newSubjects.length - 1
					function pluralize(count) {
						if (count > 1) {
							return 'students';
						}
						return 'student';
					}

					FlowRouter.go('/planning/subjects/view/' + newSubjects[0].studentId +'/'+ Session.get('selectedSchoolYearId') +'/'+ newSubjects[0].subjectId);					
					if (additionalStudentsCount >= 1 ) {
						Alerts.insert({
							colorClass: 'bg-info',
							iconClass: 'fss-info',
							message: 'This subject has been added '+ additionalStudentsCount +' to aditional '+ pluralize(additionalStudentsCount) +'.',
						});
					}
				}
			});

			return false;
		}
	});
});

Template.subjectsNew.helpers({
	subscriptionReady: function() {
		if (Template.instance().studentData.ready() && Template.instance().schoolYearData.ready() && Template.instance().termData.ready() && Template.instance().weekData.ready()) {
			return true;
		}
	},

	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}});
	},

	schoolYears: function() {
		return SchoolYears.find({}, {sort: {startYear: 1}});
	},

	selectedSchoolYear: function() {
		return SchoolYears.findOne({_id: Session.get('selectedSchoolYearId')});
	},
	
	terms: function() {
		return Terms.find({schoolYearId: Session.get('selectedSchoolYearId')}, {sort: {order: 1}});
	},

	weeks: function(termId) {
        return Weeks.find({termId: termId});
	},

	isChecked: function(studentId) {
		if (studentId === Session.get('selectedStudentId')) {
			return true;
		}
		return false;
	},

	isSelected: function(schoolYearId) {
		if (schoolYearId === Session.get('selectedSchoolYearId')) {
			return 'selected';
		}
		return '';
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

	selectedSchoolYearId: function() {
		return Session.get('selectedSchoolYearId');
	},

	selectedStudentId: function() {
		return Session.get('selectedStudentId');
	},

	selectedSubjectId: function() {
		return Session.get('selectedSubjectId');
	},
});

Template.subjectsNew.events({
	'change .js-student-id'(event) {
    	let checkedCount = $('.js-student-id:checked').length;

    	if (checkedCount === 0 && $(event.currentTarget).val() === 'true') {
    		$(event.currentTarget).prop('checked', true)
    		$('.student-error').show().css({display: 'block'});
    		setTimeout(function(){ $('.student-error').slideUp('fast'); }, 2000);
    	} else {
    		$('.student-error').slideUp('fast');
		    if ($(event.currentTarget).val() === 'true') {
		    	$(event.currentTarget).val('false');
		    } else {
		    	$(event.currentTarget).val('true');
		    }
		}
	},

	'change .js-school-year-select'(event) {
		Session.set({
			selectedSchoolYearId: event.target.value.trim(),
			editUrl: '/planning/schoolyears/edit/' + event.target.value.trim(),
		});

		let sessionSubjectIdName = 'selectedSubject' + Session.get('selectedStudentId') + event.target.value.trim() + 'Id';
		Session.set('selectedSubjectId', Session.get(sessionSubjectIdName));
	},

	'change .js-times-per-week-preset'(event) {
		$('#' + event.currentTarget.dataset.termId).find('.js-times-per-week').val(event.currentTarget.value);
	},

	'change .js-times-per-week'(event) {
		$('#' + event.currentTarget.dataset.termId + ' .js-times-per-week-preset option').removeProp('selected');
		$('#' + event.currentTarget.dataset.termId + ' .js-times-per-week-preset option:disabled').prop('selected', true);
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
				iconClass: 'fss-warning',
				message: '"' + localResource.title + ' is already attached to this subject.',
			});
		} else {
			LocalResources.insert({id: resource._id, type: resource.type, title: resource.title});

			Alerts.remove({type: 'addResource'});
			$('#search-resources').val('');
			template.searchQuery.set('');
			template.searching.set(false);
		}
	},

	'click .js-remove-resource'(event) {
		event.preventDefault();

		Alerts.remove({type: 'addResource'});
		LocalResources.remove({id: event.currentTarget.id});
	},

	'submit .js-form-subjects-new'(event) {
		event.preventDefault();
	},
});









