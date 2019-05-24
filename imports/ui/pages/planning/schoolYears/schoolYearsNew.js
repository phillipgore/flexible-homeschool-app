import {Template} from 'meteor/templating';
import { Groups } from '../../../../api/groups/groups.js';
import { Students } from '../../../../api/students/students.js';
import { Stats } from '../../../../api/stats/stats.js';
import { Paths } from '../../../../api/paths/paths.js';
import './schoolYearsNew.html';

LocalTerms = new Mongo.Collection(null);

Template.schoolYearsNew.onCreated( function() {
	let template = Template.instance();

	template.autorun( () => {
		this.subscribe('allSchoolYearPaths');
	});
});

Template.schoolYearsNew.onRendered( function() {
	let template = Template.instance();

	if (window.screen.availWidth > 640) {
		document.getElementsByClassName('frame-two')[0].scrollTop = 0;
	}

	Session.set({
		toolbarType: 'new',
		labelThree: 'New School Year',
		
		
		activeNav: 'planningList',
	});
	// Term Input Settings
	LocalTerms.remove({});
	LocalTerms.insert({term: true});

	// Total Weeks
	$('.js-total').html('0');

	// Form Validation and Submission
	$('.js-form-school-year-new').validate({
		rules: {
			startYear: { required: true, number: true, date: true },
			endYear: { number: true, date: true },
			weeksPerTerm1: { required: true, number: true, min: 1 },
		},
		messages: {
			startYear: { 
				required: "Required.", 
				number: "Must be a 4 digit year.",
				date: "Must be a 4 digit year.",

			},
			endYear: { 
				number: "Must be a  4 digit year.",
				date: "Must be a 4 digit year.",
			},
			weeksPerTerm1: { 
				required: "Must have at least one term.", 
				number: "Must be a 4 digit year.",
				min: "Must have at one week."
			},
		},		

		submitHandler() {
			$('.js-saving').show();
			$('.js-submit').prop('disabled', true);

			const schoolYearProperties = {
				startYear: template.find("[name='startYear']").value.trim(),
				endYear: template.find("[name='endYear']").value.trim(),
			}

			let termProperties = []
			$('.js-form-school-year-new').find('.js-weeks-per-term').each(function(index, weeks) {
				if (weeks.value) {
					termProperties.push({order: parseInt(index + 1), weeksPerTerm: parseInt(weeks.value)})
				}
			});

			Meteor.call('insertSchoolYear', schoolYearProperties, termProperties, function(error, schoolYearId) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'icn-danger',
						message: error.reason,
					});

					$('.js-saving').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					let pathProperties = {
						studentIds: [],
						schoolYearIds: [schoolYearId],
						termIds: [],
					};
					let groupId = Groups.findOne()._id

					Meteor.call('runPrimaryInitialIds');
					Meteor.call('runUpsertPaths', pathProperties, true, function(error, result) {

						Session.set('selectedSchoolYearId', result.schoolYearId);
						Session.set('selectedTermId', result.termId);
						Session.set('selectedWeekId', result.weekId);

						// let resourcesScrollTop = document.getElementById(schoolYearId).getBoundingClientRect().top - 130;
						// if (window.screen.availWidth > 640) {
						// 	document.getElementsByClassName('frame-two')[0].scrollTop = resourcesScrollTop;
						// }

						FlowRouter.go('/planning/schoolyears/view/3/' + result.schoolYearId);
					});
				}
			});

			return false;
		}
	});
});

Template.schoolYearsNew.helpers({
	selectedSchoolYearId: function() {
		return Session.get('selectedSchoolYearId');
	},

	localTerms: function() {
		return LocalTerms.find();
	},

	indexIncrement: function(index) {
		return index + 1;
	}
});

Template.schoolYearsNew.events({
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
				iconClass: 'icn-warning',
				message: "You have exceeded 52 weeks.",
			});
		}

		let localTermCount = LocalTerms.find().count()
		if (valueCount.length === localTermCount) {
			LocalTerms.insert({term: true});
		}
	},

	'click .js-term-delete'(event) {
		event.preventDefault();

		let localTermId = event.currentTarget.id		
		if (localTermId === $('.js-term-input:last .js-term-delete').attr('id')) {
			$('.js-term-input:last .js-weeks-per-term').val('')
		} else {
			LocalTerms.remove({_id: localTermId})
		}

		let totalWeeks = 0
		$('.js-term-inputs').find('.js-weeks-per-term').each(function() {
			if ($(this).val()) {
				totalWeeks = totalWeeks + parseInt($(this).val());
			}
		});
		$('.js-total').html(totalWeeks);
	},

	'submit .js-form-school-year-new'(event) {
		event.preventDefault();
	},

	'click .js-cancel'(event) {
		event.preventDefault();

		if (window.screen.availWidth > 640) {
			let resourcesScrollTop = document.getElementById(Session.get('selectedSchoolYearId')).getBoundingClientRect().top - 130;
			document.getElementsByClassName('frame-two')[0].scrollTop = resourcesScrollTop;
		}

		if (window.screen.availWidth > 768) {
			FlowRouter.go('/planning/schoolyears/view/3/' + Session.get('selectedSchoolYearId'))
		} else {
			FlowRouter.go('/planning/schoolyears/view/2/' + Session.get('selectedSchoolYearId'))
		}
		
	},
});