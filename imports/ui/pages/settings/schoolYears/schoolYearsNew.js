import {Template} from 'meteor/templating';
import './schoolYearsNew.html';

LocalTerms = new Mongo.Collection(null);

Template.schoolYearsNew.onRendered( function() {
	// Term Input Settings
	LocalTerms.remove({});
	LocalTerms.insert({term: true});

	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		leftCaret: false,
		label: 'New School Year',
		rightUrl: '',
		rightIcon: '',
		rightCaret: false,
	});

	// Navbar Settings
	Session.set('activeNav', 'settingsList');

	// Form Validation and Submission
	$('.js-form-school-year-new').validate({
		rules: {
			startYear: { required: true, number: true, date: true },
			endYear: { number: true, date: true },
		},
		messages: {
			startYear: { 
				required: "Required.", 
				number: "Must be a valid 4 digit year.",
				date: "Must be a valid 4 digit year.",

			},
			endYear: { 
				number: "Must be a valid 4 digit year.",
				date: "Must be a valid 4 digit year.",
			},
		},		

		submitHandler() {
			const termsProperties = []

			event.target.weeksPerTerm.forEach(function(weeks, index) {
				if (weeks.value) {
					termsProperties.push({order: index + 1, weeksPerTerm: weeks.value})
				}
			})

			const schoolYearProperties = {
				startYear: event.target.startYear.value.trim(),
				endYear: event.target.endYear.value.trim(),
				terms: termsProperties,
			}

			Meteor.call('insertSchoolYear', schoolYearProperties, function(error, schoolYearId) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-icn-danger',
						message: error.reason,
					});
				} else {
					console.log(schoolYearId)
					FlowRouter.go('/settings/schoolyears/list');
				}
			});

			return false;
		}
	});
});

Template.schoolYearsNew.helpers({
	localTerms: function() {
		return LocalTerms.find();
	},

	indexIncrement: function(index) {
		return index + 1;
	}
});

Template.schoolYearsNew.events({
	'keyup, .js-term-inputs .js-weeks-per-term'(event) {
		let valueCount = [];
		$('.js-term-inputs').find('.js-weeks-per-term').each(function() {
			if ($(this).val()) {
				valueCount.push($(this).val())
			}
		})

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
	},

	'submit .js-form-school-year-new'(event) {
		event.preventDefault();
	},
});