import _ from 'lodash'

// Students
FlowRouter.route('/planning/students/new', {
	name: 'studentsNew',
	action() {
		BlazeLayout.render('app', {
			frameOne: 'planningList',
			frameTwo: 'studentsList',
			frameThree: 'studentsNew',
		});
	},
});

FlowRouter.route('/planning/students/view/:selectedStudentId', {
	name: 'studentsView',
	action() {
		BlazeLayout.render('app', {
			frameOne: 'planningList',
			frameTwo: 'studentsList',
			frameThree: 'studentsView',
		});
	},
});

FlowRouter.route('/planning/students/edit/:selectedStudentId', {
	name: 'studentsEdit',
	action() {
		BlazeLayout.render('app', {
			frameOne: 'planningList',
			frameTwo: 'studentsList',
			frameThree: 'studentsEdit',
		});
	},
});




// School Years
FlowRouter.route('/planning/schoolyears/new', {
	name: 'schoolYearsNew',
	action() {
		LocalTerms.remove();
		BlazeLayout.render('app', {
			frameOne: 'planningList',
			frameTwo: 'schoolYearsList',
			frameThree: 'schoolYearsNew',
		});
	},
});

FlowRouter.route('/planning/schoolyears/view/:selectedSchoolYearId', {
	name: 'schoolYearsView',
	action() {
		BlazeLayout.render('app', {
			frameOne: 'planningList',
			frameTwo: 'schoolYearsList',
			frameThree: 'schoolYearsView',
		});
	},
});

FlowRouter.route('/planning/schoolyears/edit/:selectedSchoolYearId', {
	name: 'schoolYearsEdit',
	action() {
		BlazeLayout.render('app', {
			frameOne: 'planningList',
			frameTwo: 'schoolYearsList',
			frameThree: 'schoolYearsView',
		});
	},
});




// Resources
FlowRouter.route('/planning/resources/new/:selectedResourceType/:selectedResourceAvailability/:selectedResourceType', {
	name: 'resourcesNew',
	action: function(params) {
		BlazeLayout.render('app', {
			frameOne: 'planningList',
			frameTwo: 'resourcesList',
			frameThree: 'resourcesNew' + _.capitalize(params.selectedResourceType),
		});
	},
});


FlowRouter.route('/planning/resources/view/:selectedResourceType/:selectedResourceAvailability/:selectedResourceId', {
	name: 'resourcesView',
	action() {
		BlazeLayout.render('app', {
			frameOne: 'planningList',
			frameTwo: 'resourcesList',
			frameThree: 'resourcesView',
		});
	},
});

FlowRouter.route('/planning/resources/edit/:selectedResourceId/:selectedResourceType/:selectedResourceId', {
	name: 'resourcesEdit',
	action: function(params, queryParams) {
		BlazeLayout.render('app', {
			frameOne: 'planningList',
			frameTwo: 'resourcesList',
			frameThree: 'resourcesEdit' + _.capitalize(params.selectedResourceType),
		});
	},
});




// Subjects
FlowRouter.route('/planning/subjects/list/:selectedSchoolYearId/:selectedStudentId', {
	name: 'subjectsList',
	action() {
		BlazeLayout.reset();
		BlazeLayout.render('app', {
			frameOne: 'subjectsList',
		});
	},
});

FlowRouter.route('/planning/subjects/new', {
	name: 'subjectsNew',
	action() {
		BlazeLayout.render('app', {
			frameOne: 'subjectsNew',
		});
	},
});

FlowRouter.route('/planning/subjects/view/:selectedSubjectId', {
	name: 'subjectsView',
	action() {
		BlazeLayout.render('app', {
			frameOne: 'subjectsView',
		});
	},
});

FlowRouter.route('/planning/subjects/edit/:selectedSubjectId', {
	name: 'subjectsEdit',
	action() {
		BlazeLayout.render('app', {
			frameOne: 'subjectsEdit',
		});
	},
});







