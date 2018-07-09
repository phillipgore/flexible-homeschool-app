import _ from 'lodash'

// Students
FlowRouter.route('/planning/students/new', {
	name: 'studentsNew',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
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
			subbar: '',
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
			subbar: '',
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
			subbar: '',
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
			subbar: '',
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
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'schoolYearsList',
			frameThree: 'schoolYearsEdit',
		});
	},
});




// Resources
FlowRouter.route('/planning/resources/new/:selectedResourceType/:selectedResourceAvailability/:selectedResourceNewType', {
	name: 'resourcesNew',
	action: function(params) {
		BlazeLayout.render('app', {
			subbar: 'subbarResources',
			frameOne: 'planningList',
			frameTwo: 'resourcesList',
			frameThree: 'resourcesNew' + _.capitalize(params.selectedResourceNewType),
		});
	},
});


FlowRouter.route('/planning/resources/view/:selectedResourceType/:selectedResourceAvailability/:selectedResourceId/:selectedResourceCurrentTypeId', {
	name: 'resourcesView',
	action() {
		BlazeLayout.render('app', {
			subbar: 'subbarResources',
			frameOne: 'planningList',
			frameTwo: 'resourcesList',
			frameThree: 'resourcesView',
		});
	},
});

FlowRouter.route('/planning/resources/edit/:selectedResourceType/:selectedResourceAvailability/:selectedResourceId/:selectedResourceCurrentTypeId', {
	name: 'resourcesEdit',
	action: function(params, queryParams) {
		BlazeLayout.render('app', {
			subbar: 'subbarResources',
			frameOne: 'planningList',
			frameTwo: 'resourcesList',
			frameThree: 'resourcesEdit' + _.capitalize(params.selectedResourceCurrentTypeId),
		});
	},
});




// Subjects
FlowRouter.route('/planning/subjects/new/:selectedStudentId/:selectedSchoolYearId', {
	name: 'subjectsNew',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'subjectsNewList',
			frameThree: 'subjectsNew',
		});
	},
});

FlowRouter.route('/planning/subjects/view/:selectedStudentId/:selectedSchoolYearId/:selectedSubjectId', {
	name: 'subjectsView',
	action() {
		BlazeLayout.render('app', {
			subbar: 'subbarSubjects',
			frameOne: 'planningList',
			frameTwo: 'subjectsList',
			frameThree: 'subjectsView',
		});
	},
});

FlowRouter.route('/planning/subjects/edit/:selectedStudentId/:selectedSchoolYearId/:selectedSubjectId', {
	name: 'subjectsEdit',
	action() {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'subjectsList',
			frameThree: 'subjectsEdit',
		});
	},
});







