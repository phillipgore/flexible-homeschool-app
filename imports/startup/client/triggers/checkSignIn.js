// Redirection if signed in.
function checkSignIn(context, redirect) {
	if (Meteor.userId()) {
		// getInitialData();
		if (Meteor.user().info.role === 'Observer') {
			redirect('/tracking/students/view/1/' + Session.get('selectedStudentId') +'/'+ Session.get('selectedSchoolYearId') +'/'+ Session.get('selectedTermId') +'/'+ Session.get('selectedWeekId'));
		} else if (Counts.get('studentCount') + Counts.get('schoolYearCount') + Counts.get('schoolWorkCount')) {
			redirect('/tracking/students/view/1/' + Session.get('selectedStudentId') +'/'+ Session.get('selectedSchoolYearId') +'/'+ Session.get('selectedTermId') +'/'+ Session.get('selectedWeekId'));
		} else {
			redirect('/planning/students/view/1/' + Session.get('selectedStudentId'));
		}
	};
};

FlowRouter.triggers.enter([checkSignIn], {only: [
	'createAccount',
	'verifySent',
	'verifySuccess',
	'signIn',
	'reset',
	'resetSent',
	'resetPassword',
	'resetSuccess'
]});