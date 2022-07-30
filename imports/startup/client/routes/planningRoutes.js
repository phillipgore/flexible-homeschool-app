import _ from 'lodash'

// Students
FlowRouter.route('/planning/students/new/:selectedFramePosition', {
	name: 'studentsNew',
	title:  'Planning: Students: New',
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
	title:  'Planning: Students: View',
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
	title:  'Planning: Students: Edit',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'studentsList',
			frameThree: 'studentsEdit',
		});
	},
});




// Student Groups
FlowRouter.route('/planning/studentgroups/new/:selectedFramePosition', {
	name: 'studentGroupsNew',
	title:  'Planning: Student Groups: New',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'studentsList',
			frameThree: 'studentGroupsNew',
		});
	},
});

FlowRouter.route('/planning/studentgroups/view/:selectedFramePosition/:selectedStudentGroupId', {
	name: 'studentGroupsView',
	title:  'Planning: Student Groups: View',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'studentsList',
			frameThree: 'studentGroupsView',
		});
	},
});

FlowRouter.route('/planning/studentgroups/edit/:selectedFramePosition/:selectedStudentGroupId', {
	name: 'studentGroupsEdit',
	title:  'Planning: Student Groups: Edit',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'studentsList',
			frameThree: 'studentGroupsEdit',
		});
	},
});




// School Years
FlowRouter.route('/planning/schoolyears/new/:selectedFramePosition', {
	name: 'schoolYearsNew',
	title:  'Planning: School Year: New',
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
	title:  'Planning: School Year: View',
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
	title:  'Planning: School Year: Edit',
	action(params) {
		BlazeLayout.render('app', {
			subbar: '',
			frameOne: 'planningList',
			frameTwo: 'schoolYearsList',
			frameThree: 'schoolYearsEdit',
		});
	},
});




// Subjects (students)
FlowRouter.route('/planning/subjects/new/:selectedFramePosition/students/:selectedStudentId/:selectedSchoolYearId', {
	name: 'subjectsNew',
	title:  'Planning: Subjects: New',
	action(params) {
		Session.set('selectedStudentIdType', 'students');
		BlazeLayout.render('app', {
			subbar: 'subbarSchoolWork',
			frameOne: 'planningList',
			frameTwo: 'schoolWorkList',
			frameThree: 'subjectsNew',
		});
	},
});

FlowRouter.route('/planning/subjects/view/:selectedFramePosition/students/:selectedStudentId/:selectedSchoolYearId/:selectedSubjectId', {
	name: 'subjectsView',
	title:  'Planning: Subject: View',
	action(params) {
		Session.set('selectedStudentIdType', 'students');
		BlazeLayout.render('app', {
			subbar: 'subbarSchoolWork',
			frameOne: 'planningList',
			frameTwo: 'schoolWorkList',
			frameThree: 'subjectsView',
		});
	},
});

FlowRouter.route('/planning/subjects/edit/:selectedFramePosition/students/:selectedStudentId/:selectedSchoolYearId/:selectedSubjectId', {
	name: 'subjectsEdit',
	title:  'Planning: Subject: Edit',
	action(params) {
		Session.set('selectedStudentIdType', 'students');
		BlazeLayout.render('app', {
			subbar: 'subbarSchoolWork',
			frameOne: 'planningList',
			frameTwo: 'schoolWorkList',
			frameThree: 'subjectsEdit',
		});
	},
});

// Subjects (studentgroups)
FlowRouter.route('/planning/subjects/new/:selectedFramePosition/studentgroups/:selectedStudentGroupId/:selectedSchoolYearId', {
	name: 'subjectsNew',
	title:  'Planning: Subjects: New',
	action(params) {
		Session.set('selectedStudentIdType', 'studentgroups');
		BlazeLayout.render('app', {
			subbar: 'subbarSchoolWork',
			frameOne: 'planningList',
			frameTwo: 'schoolWorkList',
			frameThree: 'subjectsNew',
		});
	},
});

FlowRouter.route('/planning/subjects/view/:selectedFramePosition/studentgroups/:selectedStudentGroupId/:selectedSchoolYearId/:selectedSubjectId', {
	name: 'subjectsView',
	title:  'Planning: Subject: View',
	action(params) {
		Session.set('selectedStudentIdType', 'studentgroups');
		BlazeLayout.render('app', {
			subbar: 'subbarSchoolWork',
			frameOne: 'planningList',
			frameTwo: 'schoolWorkList',
			frameThree: 'subjectsView',
		});
	},
});

FlowRouter.route('/planning/subjects/edit/:selectedFramePosition/studentgroups/:selectedStudentGroupId/:selectedSchoolYearId/:selectedSubjectId', {
	name: 'subjectsEdit',
	title:  'Planning: Subject: Edit',
	action(params) {
		Session.set('selectedStudentIdType', 'studentgroups');
		BlazeLayout.render('app', {
			subbar: 'subbarSchoolWork',
			frameOne: 'planningList',
			frameTwo: 'schoolWorkList',
			frameThree: 'subjectsEdit',
		});
	},
});




// School Work (students)
FlowRouter.route('/planning/work/new/:selectedFramePosition/students/:selectedStudentId/:selectedSchoolYearId', {
	name: 'workNew',
	title:  'Planning: School Work: New',
	action(params) {
		Session.set('selectedStudentIdType', 'students');
		BlazeLayout.render('app', {
			subbar: 'subbarSchoolWork',
			frameOne: 'planningList',
			frameTwo: 'schoolWorkList',
			frameThree: 'workNew',
		});
	},
});

FlowRouter.route('/planning/work/view/:selectedFramePosition/students/:selectedStudentId/:selectedSchoolYearId/:selectedSchoolWorkId', {
	name: 'workView',
	title:  'Planning: School Work: View',
	action(params) {
		Session.set('selectedStudentIdType', 'students');
		BlazeLayout.render('app', {
			subbar: 'subbarSchoolWork',
			frameOne: 'planningList',
			frameTwo: 'schoolWorkList',
			frameThree: 'workView',
		});
	},
});

FlowRouter.route('/planning/work/edit/:selectedFramePosition/students/:selectedStudentId/:selectedSchoolYearId/:selectedSchoolWorkId', {
	name: 'workEdit',
	title:  'Planning: School Work: Edit',
	action(params) {
		Session.set('selectedStudentIdType', 'students');
		BlazeLayout.render('app', {
			subbar: 'subbarSchoolWork',
			frameOne: 'planningList',
			frameTwo: 'schoolWorkList',
			frameThree: 'workEdit',
		});
	},
});

// School Work (studentgroups)
FlowRouter.route('/planning/work/new/:selectedFramePosition/studentgroups/:selectedStudentGroupId/:selectedSchoolYearId', {
	name: 'workNew',
	title:  'Planning: School Work: New',
	action(params) {
		Session.set('selectedStudentIdType', 'studentgroups');
		BlazeLayout.render('app', {
			subbar: 'subbarSchoolWork',
			frameOne: 'planningList',
			frameTwo: 'schoolWorkList',
			frameThree: 'workNew',
		});
	},
});

FlowRouter.route('/planning/work/view/:selectedFramePosition/studentgroups/:selectedStudentGroupId/:selectedSchoolYearId/:selectedSchoolWorkId', {
	name: 'workView',
	title:  'Planning: School Work: View',
	action(params) {
		Session.set('selectedStudentIdType', 'studentgroups');
		BlazeLayout.render('app', {
			subbar: 'subbarSchoolWork',
			frameOne: 'planningList',
			frameTwo: 'schoolWorkList',
			frameThree: 'workView',
		});
	},
});

FlowRouter.route('/planning/work/edit/:selectedFramePosition/studentgroups/:selectedStudentGroupId/:selectedSchoolYearId/:selectedSchoolWorkId', {
	name: 'workEdit',
	title:  'Planning: School Work: Edit',
	action(params) {
		Session.set('selectedStudentIdType', 'studentgroups');
		BlazeLayout.render('app', {
			subbar: 'subbarSchoolWork',
			frameOne: 'planningList',
			frameTwo: 'schoolWorkList',
			frameThree: 'workEdit',
		});
	},
});




// Resources
FlowRouter.route('/planning/resources/new/:selectedFramePosition/:selectedResourceType/:selectedResourceAvailability/:selectedResourceNewType', {
	name: 'resourcesNew',
	title:  'Planning: Resources: New',
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
	title:  'Planning: Resources: View',
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
	title:  'Planning: Resources: Edit',
	action: function(params, queryParams) {
		BlazeLayout.render('app', {
			subbar: 'subbarResources',
			frameOne: 'planningList',
			frameTwo: 'resourcesList',
			frameThree: 'resourcesEdit',
		});
	},
});







