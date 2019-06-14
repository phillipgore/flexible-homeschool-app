import {Template} from 'meteor/templating';
import { Students } from '../../../../api/students/students.js';
import { Resources } from '../../../../api/resources/resources.js';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Weeks } from '../../../../api/weeks/weeks.js';

import {requiredValidation} from '../../../../modules/functions';
import YTPlayer from 'yt-player';
import _ from 'lodash'
import './schoolWorkNew.html';

LocalResources = new Mongo.Collection(null);

Template.schoolWorkNew.onCreated( function() {
	Session.setPersistent('unScrolled', true);
	
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

Template.schoolWorkNew.onRendered( function() {
	let template = Template.instance();

	if (window.screen.availWidth > 640) {
		document.getElementsByClassName('frame-two')[0].scrollTop = 0;
	}

	const playerOne = new YTPlayer('#playerOne');
	const playerTwo = new YTPlayer('#playerTwo');
	const playerThree = new YTPlayer('#playerThree');

	playerOne.load('JVLHvgwShww');
	playerTwo.load('lGxPOUiT6nU');
	playerThree.load('cnG64tjn1sg');

	// Resources Input Settings
	LocalResources.remove({});

	// School Year Id Settings
	Session.set({schoolYearId: ''})

	Session.set({
		toolbarType: 'new',
		labelThree: 'New School Work',
		activeNav: 'planningList',
	});

	// Form Validation and Submission
	$('.js-form-school-work-new').validate({
		rules: {
			timesPerWeek: { number: true, max: 7 },
		},
		messages: {
			timesPerWeek: { number: "Number Required.", max: 'Limit 7.' },
		},

		submitHandler() {
			$('.js-saving').show();
			$('.js-submit').prop('disabled', true);

			let studentIds = []
			$("[name='studentId']:checked").each(function() {
				studentIds.push(this.id)
			})

			let resourceIds = [];
			LocalResources.find().forEach(function(resource) {
				resourceIds.push(resource.id);
			});

			let schoolYearId = template.find("[name='schoolYearId']").value.trim();
			const schoolWorkProperties = {
				name: template.find("[name='name']").value.trim(),
				description: $('.js-form-school-work-new .editor-content').html(),
				resources: resourceIds,
				schoolYearId: schoolYearId,
			};

			let lessonProperties = [];
			let weekIds = [];
			$("[name='timesPerWeek']").each(function(index) {
				for (i = 0; i < parseInt(this.value); i++) {
				    lessonProperties.push({
				    	order: i + 1,
				    	schoolYearId: schoolYearId, 
				    	termId: this.dataset.termId,
				    	termOrder: parseInt(this.dataset.termOrder), 
				    	weekId: this.dataset.weekId,
				    	weekOrder: parseInt(this.dataset.weekOrder),
				    });
				    weekIds.push(this.dataset.weekId)
				}
			});

			let pathProperties = {
				studentIds: studentIds,
				schoolYearIds: [schoolYearId],
				termIds: Array.from(document.getElementsByClassName('js-term-container')).map(term => term.id),
			};

			let statProperties = {
				studentIds: studentIds,
				schoolYearIds: [schoolYearId],
				termIds: Array.from(document.getElementsByClassName('js-term-container')).map(term => term.id),
				weekIds: _.uniq(weekIds),
			}
			
			Meteor.call('insertSchoolWork', studentIds, schoolWorkProperties, lessonProperties, function(error, newSchoolWork) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'icn-danger',
						message: error.reason,
					});
					
					$('.js-saving').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					Meteor.call('runUpsertSchoolWorkPathsAndStats', pathProperties, statProperties, function(error, result) {
						if (error) {
							Alerts.insert({
								colorClass: 'bg-danger',
								iconClass: 'icn-danger',
								message: error.reason,
							});
							
							$('.js-saving').hide();
							$('.js-submit').prop('disabled', false);
						} else {
							Session.set('selectedStudentId', newSchoolWork[0].studentId);
							Session.set('selectedSchoolWorkId', newSchoolWork[0].schoolWorkId);
							let studentsCount = newSchoolWork.length

							FlowRouter.go('/planning/schoolWork/view/3/' + newSchoolWork[0].studentId +'/'+ Session.get('selectedSchoolYearId') +'/'+ newSchoolWork[0].schoolWorkId);					
							if (studentsCount > 1 ) {
								Alerts.insert({
									colorClass: 'bg-info',
									iconClass: 'icn-info',
									message: 'This School Work has been added to '+ studentsCount +' total students.',
								});
							}
						}
					});
				}
			});

			return false;
		}
	});
});

Template.schoolWorkNew.helpers({
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

	weekCount: function(termId) {
        return Weeks.find({termId: termId}).count();
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

	selectedSchoolWorkId: function() {
		return Session.get('selectedSchoolWorkId');
	},
});

Template.schoolWorkNew.events({
	'change .js-student-id'(event) {
    	let checkedCount = $('.js-student-id:checked').length;

    	if (checkedCount === 0 && $(event.currentTarget).val() === 'true') {
    		$(event.currentTarget).prop('checked', true)
    		$('.student-error').show().css({display: 'block'});
    		setTimeout(function() { 
    			$('.student-error').slideUp('fast'); 
    		}, 2000);
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

		let sessionSchoolWorkIdName = 'selectedSchoolWork' + Session.get('selectedStudentId') + event.target.value.trim() + 'Id';
		Session.set('selectedSchoolWorkId', Session.get(sessionSchoolWorkIdName));
	},

	'change .js-times-per-week-preset'(event) {
		$('#' + event.currentTarget.dataset.termId).find('.js-times-per-week').val(event.currentTarget.value);
	},

	'keyup .js-times-per-week'(event) {
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
				message: '"' + localResource.title + ' is already attached to this schoolWork.',
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

			$('.js-step').hide();
			$('.' + stepClass).show();
		}
		if (stepClass === 'js-step-two') {
			if ( requiredValidation($("[name='name']").val().trim()) ) {
				$('#name').removeClass('error');
				$('.name-errors').text('');

				$('.js-step-circle').removeClass('bg-info');
				$('.js-circle-two').addClass('bg-info');

				$('.js-step').hide();
				$('.' + stepClass).show();
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

				$('.js-step').hide();
				$('.' + stepClass).show();
			} else {
				$('#name').addClass('error');
				$('.name-errors').text('Required.');
			}
		}
	},

	'submit .js-form-school-work-new'(event) {
		event.preventDefault();
	},

	'click .js-cancel'(event) {
		event.preventDefault();

		if (window.screen.availWidth > 768) {
			FlowRouter.go('/planning/schoolWork/view/3/' + Session.get('selectedStudentId') +'/'+ Session.get('selectedSchoolYearId') +'/'+ Session.get('selectedSchoolWorkId'))
		} else {
			FlowRouter.go('/planning/schoolWork/view/2/' + Session.get('selectedStudentId') +'/'+ Session.get('selectedSchoolYearId') +'/'+ Session.get('selectedSchoolWorkId'))
		}
		
	},
});









