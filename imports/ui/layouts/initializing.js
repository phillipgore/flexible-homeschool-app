import {Template} from 'meteor/templating';
import './initializing.html';

Template.initializing.onRendered( function() {
	if (Session.get('initialized')) {
		if (Meteor.user().info.role === 'Observer') {
			FlowRouter.go('/tracking/students/view/1/' + Session.get('selectedStudentId') +'/'+ Session.get('selectedSchoolYearId') +'/'+ Session.get('selectedTermId') +'/'+ Session.get('selectedWeekId'));
		} else if (Counts.get('studentCount') + Counts.get('schoolYearCount') + Counts.get('subjectCount')) {
			FlowRouter.go('/tracking/students/view/1/' + Session.get('selectedStudentId') +'/'+ Session.get('selectedSchoolYearId') +'/'+ Session.get('selectedTermId') +'/'+ Session.get('selectedWeekId'));
		} else {
			FlowRouter.go('/planning/students/view/1/' + Session.get('selectedStudentId'));
		}
	}
})