import _ from 'lodash'

// Students
FlowRouter.route('/planning/students/new/:selectedFramePosition', {
	name: 'studentsNew',
	// title: 'Student: New',
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
	// title: 'Student: View',
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
	// title: 'Student: Edit',
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
	// title: 'School Year: New',
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
	// title: 'School Year: View',
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
	// title: 'School Year: Edit',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'schoolYearsList',
			frameThree: 'schoolYearsEdit',
		});
	},
});




// School Work
FlowRouter.route('/planning/schoolWork/new/:selectedFramePosition/:selectedStudentId/:selectedSchoolYearId', {
	name: 'schoolWorkNew',
	// title: 'School Work: New',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'schoolWorkNewList',
			frameThree: 'schoolWorkNew',
		});
	},
});

FlowRouter.route('/planning/schoolWork/view/:selectedFramePosition/:selectedStudentId/:selectedSchoolYearId/:selectedSchoolWorkId', {
	name: 'schoolWorkView',
	// title: 'School Work: View',
	action(params) {
		BlazeLayout.render('app', {
			subbar: 'subbarSchoolWork',
			frameOne: 'planningList',
			frameTwo: 'schoolWorkList',
			frameThree: 'schoolWorkView',
		});
	},
});

FlowRouter.route('/planning/schoolWork/edit/:selectedFramePosition/:selectedStudentId/:selectedSchoolYearId/:selectedSchoolWorkId', {
	name: 'schoolWorkEdit',
	// title: 'School Work: Edit',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'schoolWorkList',
			frameThree: 'schoolWorkEdit',
		});
	},
});




// Resources
FlowRouter.route('/planning/resources/new/:selectedFramePosition/:selectedResourceType/:selectedResourceAvailability/:selectedResourceNewType', {
	name: 'resourcesNew',
	// title: 'Resource: New',
	action: function(params) {
		BlazeLayout.render('app', {
			subbar: 'subbarResources',
			frameOne: 'planningList',
			frameTwo: 'resourcesList',
			frameThree: 'resourcesNew',
		});
	},
});


FlowRouter.route('/planning/resources/view/:selectedFramePosition/:selectedResourceType/:selectedResourceAvailability/:selectedResourceId/:selectedResourceCurrentTypeId', {
	name: 'resourcesView',
	// title: 'Resource: View',
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
	// title: 'Resource: Edit',
	action: function(params, queryParams) {
		BlazeLayout.render('app', {
			subbar: 'subbarResources',
			frameOne: 'planningList',
			frameTwo: 'resourcesList',
			frameThree: 'resourcesEdit',
		});
	},
});







