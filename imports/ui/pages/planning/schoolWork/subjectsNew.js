import {Template} from 'meteor/templating';
import { Students } from '../../../../api/students/students.js';
import { Resources } from '../../../../api/resources/resources.js';
import { SchoolYears } from '../../../../api/schoolYears/schoolYears.js';
import { Terms } from '../../../../api/terms/terms.js';
import { Weeks } from '../../../../api/weeks/weeks.js';

import {requiredValidation} from '../../../../modules/functions';
import YTPlayer from 'yt-player';
import _ from 'lodash'
import './subjectsNew.html';

LocalResources = new Mongo.Collection(null);

Template.subjectsNew.onCreated( function() {	
	Session.setPersistent('unScrolled', true);
	
	// Subscriptions
	this.studentData = this.subscribe('allStudents');
});

Template.subjectsNew.onRendered( function() {
	let template = Template.instance();

	if (window.screen.availWidth > 640) {
		document.getElementsByClassName('frame-two')[0].scrollTop = 0;
	}

	Session.set({
		toolbarType: 'new',
		labelThree: 'New Subject',
		activeNav: 'planningList',
	});
});

Template.subjectsNew.helpers({
	subscriptionReady: function() {
		return Template.instance().studentData.ready();
	},

	students: function() {
		return Students.find({}, {sort: {birthday: 1, lastName: 1, 'preferredFirstName.name': 1}});
	},

	isChecked: function(studentId) {
		if (studentId === Session.get('selectedStudentId')) {
			return true;
		}
		return false;
	},
});

Template.subjectsNew.events({
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

	'submit .js-form-subjects-new'(event, template) {
		event.preventDefault();

		if ( !requiredValidation($("[name='name']").val().trim()) ) {
			$('#name').addClass('error');
			$('.name-errors').text('Required.');
		} else {
			$('#name').removeClass('error');
			$('.name-errors').text('');

			$('.js-saving').show();
			$('.js-submit').prop('disabled', true);

			let studentIds = []
			$("[name='studentId']:checked").each(function() {
				studentIds.push(this.id)
			})

			const subjectProperties = {
				order: 1,
				type: 'subject',
				name: template.find("[name='name']").value.trim(),
				schoolYearId: FlowRouter.getParam('selectedSchoolYearId'),
			};

			Meteor.call('insertSubject', studentIds, subjectProperties, function(error, result) {
				if (error) {
					Alerts.insert({
						colorClass: 'bg-danger',
						iconClass: 'icn-danger',
						message: error.reason,
					});
					
					$('.js-saving').hide();
					$('.js-submit').prop('disabled', false);
				} else {
					console.log(result);
				}
			});

			return false;
		}
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








