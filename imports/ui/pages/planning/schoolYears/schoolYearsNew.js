import {Template} from 'meteor/templating';
import './schoolYearsNew.html';

LocalTerms = new Mongo.Collection(null);

Template.schoolYearsNew.onRendered( function() {
	// Term Input Settings
	LocalTerms.remove({});
	LocalTerms.insert({term: true});

	// Total Weeks
	$('.js-total').html('0');

	// Toolbar Settings
	Session.set({
		leftUrl: '',
		leftIcon: '',
		label: 'New School Year',
		rightUrl: '',
		rightIcon: '',
	});

	// Navbar Settings
	Session.set('activeNav', 'planningList');

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
			$('.js-loading').show();
			$('.js-submit').prop('disabled', true);

			let termProperties = []

			event.target.weeksPerTerm.forEach(function(weeks, index) {
				if (weeks.value) {
					termProperties.push({order: parseInt(index + 1), weeksPerTerm: parseInt(weeks.value)})
				}
			})

			const schoolYearProperties = {
				startYear: event.target.startYear.value.trim(),
				endYear: event.target.endYear.value.trim(),
			}

			Meteor.call('insertSchoolYear', schoolYearProperties, function(error, schoolYearId) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'fss-danger',
						message: error.reason,
					});
					
					$('.js-loading').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					termProperties.forEach(function(term) {
						const weeksPerTerm = term.weeksPerTerm;
						term.schoolYearId = schoolYearId;
						delete term.weeksPerTerm;

						Meteor.call('insertTerm', term, function(error, termId) {
							if (error) {
								Alerts.insert({
									colorClass: 'bg-danger',
									iconClass: 'fss-danger',
									message: error.reason,
								});
					
								$('.js-loading').hide();
								$('.js-submit').prop('disabled', false);
							} else {
								let weekProperties = []
								
								for (i = 0; i < parseInt(weeksPerTerm); i++) { 
								    weekProperties.push({order: i + 1, termId: termId});
								}

								Meteor.call('insertWeeks', weekProperties, function(error) {
									if (error) {
										Alerts.insert({
											colorClass: 'bg-danger',
											iconClass: 'fss-danger',
											message: error.reason,
										});
					
										$('.js-loading').hide();
										$('.js-submit').prop('disabled', false);
									} else {
										FlowRouter.go('/planning/schoolyears/view/' + schoolYearId);
									}
								});
							}
						});

					});
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
});