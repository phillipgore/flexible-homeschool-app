import {Template} from 'meteor/templating';
import './initializing.html';

Template.initializing.onCreated( function() {
	if (Session.get('initialized')) {
		console.log('initialized')
		if (Meteor.user().info.role === 'Observer') {
			console.log('Observer')
			FlowRouter.go('/tracking/students/view/1/' + Session.get('selectedStudentId') +'/'+ Session.get('selectedSchoolYearId') +'/'+ Session.get('selectedTermId') +'/'+ Session.get('selectedWeekId'));
		} else if (Counts.get('studentCount') + Counts.get('schoolYearCount') + Counts.get('schoolWorkCount')) {
			console.log('Tracking')
			FlowRouter.go('/tracking/students/view/1/' + Session.get('selectedStudentId') +'/'+ Session.get('selectedSchoolYearId') +'/'+ Session.get('selectedTermId') +'/'+ Session.get('selectedWeekId'));
		} else {
			console.log('Planning')
			FlowRouter.go('/planning/students/view/1/' + Session.get('selectedStudentId'));
		}
	}
})