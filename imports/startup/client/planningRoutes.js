import _ from 'lodash'

// Students
FlowRouter.route('/planning/students/new/:selectedFramePosition', {
	name: 'studentsNew',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'studentsList',
			frameThree: 'studentsNew',
		});
	},
});

FlowRouter.route('/planning/students/view/:selectedFramePosition/:selectedStudentId', {
	name: 'studentsView',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'studentsList',
			frameThree: 'studentsView',
		});
	},
});

FlowRouter.route('/planning/students/edit/:selectedFramePosition/:selectedStudentId', {
	name: 'studentsEdit',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'studentsList',
			frameThree: 'studentsEdit',
		});
	},
});




// School Years
FlowRouter.route('/planning/schoolyears/new/:selectedFramePosition', {
	name: 'schoolYearsNew',
	action(params) {
		LocalTerms.remove();
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'schoolYearsList',
			frameThree: 'schoolYearsNew',
		});
	},
});

FlowRouter.route('/planning/schoolyears/view/:selectedFramePosition/:selectedSchoolYearId', {
	name: 'schoolYearsView',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'schoolYearsList',
			frameThree: 'schoolYearsView',
		});
	},
});

FlowRouter.route('/planning/schoolyears/edit/:selectedFramePosition/:selectedSchoolYearId', {
	name: 'schoolYearsEdit',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'schoolYearsList',
			frameThree: 'schoolYearsEdit',
		});
	},
});




// Resources
FlowRouter.route('/planning/resources/new/:selectedFramePosition/:selectedResourceType/:selectedResourceAvailability/:selectedResourceNewType', {
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


FlowRouter.route('/planning/resources/view/:selectedFramePosition/:selectedResourceType/:selectedResourceAvailability/:selectedResourceId/:selectedResourceCurrentTypeId', {
	name: 'resourcesView',
	action(params) {
		BlazeLayout.render('app', {
			subbar: 'subbarResources',
			frameOne: 'planningList',
			frameTwo: 'resourcesList',
			frameThree: 'resourcesView',
		});
	},
});

FlowRouter.route('/planning/resources/edit/:selectedFramePosition/:selectedResourceType/:selectedResourceAvailability/:selectedResourceId/:selectedResourceCurrentTypeId', {
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
FlowRouter.route('/planning/subjects/new/:selectedFramePosition/:selectedStudentId/:selectedSchoolYearId', {
	name: 'subjectsNew',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'subjectsNewList',
			frameThree: 'subjectsNew',
		});
	},
});

FlowRouter.route('/planning/subjects/view/:selectedFramePosition/:selectedStudentId/:selectedSchoolYearId/:selectedSubjectId', {
	name: 'subjectsView',
	action(params) {
		BlazeLayout.render('app', {
			subbar: 'subbarSubjects',
			frameOne: 'planningList',
			frameTwo: 'subjectsList',
			frameThree: 'subjectsView',
		});
	},
});

FlowRouter.route('/planning/subjects/edit/:selectedFramePosition/:selectedStudentId/:selectedSchoolYearId/:selectedSubjectId', {
	name: 'subjectsEdit',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'subjectsList',
			frameThree: 'subjectsEdit',
		});
	},
});







