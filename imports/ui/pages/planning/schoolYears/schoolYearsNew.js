import {Template} from 'meteor/templating';
import './schoolYearsNew.html';

LocalTerms = new Mongo.Collection(null);

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

			Meteor.call('insertSchoolYear', schoolYearProperties, function(error, schoolYearId) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'icn-danger',
						message: error.reason,
					});
					
					$('.js-saving').hide();
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
									iconClass: 'icn-danger',
									message: error.reason,
								});
					
								$('.js-saving').hide();
								$('.js-submit').prop('disabled', false);
							} else {
								let weekProperties = []
								
								for (i = 0; i < parseInt(weeksPerTerm); i++) { 
								    weekProperties.push({order: i + 1, schoolYearId: schoolYearId, termId: termId, termOrder: term.order});
								}

								Meteor.call('batchInsertWeeks', weekProperties, function(error) {
									if (error) {
										Alerts.insert({
											colorClass: 'bg-danger',
											iconClass: 'icn-danger',
											message: error.reason,
										});
					
										$('.js-saving').hide();
										$('.js-submit').prop('disabled', false);
									} else {
										Session.set('selectedSchoolYearId', schoolYearId)

										// let resourcesScrollTop = document.getElementById(schoolYearId).getBoundingClientRect().top - 130;
										// if (window.screen.availWidth > 640) {
										// 	document.getElementsByClassName('frame-two')[0].scrollTop = resourcesScrollTop;
										// }
										
										FlowRouter.go('/planning/schoolyears/view/3/' + schoolYearId);
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

		let resourcesScrollTop = document.getElementById(Session.get('selectedSchoolYearId')).getBoundingClientRect().top - 130;
		if (window.screen.availWidth > 640) {
			document.getElementsByClassName('frame-two')[0].scrollTop = resourcesScrollTop;
		}
		
		FlowRouter.go('/planning/schoolyears/view/3/' + Session.get('selectedSchoolYearId'))
	},
});