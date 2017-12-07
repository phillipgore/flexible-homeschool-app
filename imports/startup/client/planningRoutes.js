FlowRouter.route('/planning/list', {
	name: 'planningList',
	action() {
		BlazeLayout.render('app', {
			main: 'planningList',
		});
	},
});




// School Years
FlowRouter.route('/planning/schoolyears/new', {
	name: 'schoolYearsNew',
	action() {
		LocalTerms.remove();
		BlazeLayout.render('app', {
			main: 'schoolYearsNew',
		});
	},
});

FlowRouter.route('/planning/schoolyears/list', {
	name: 'schoolYearsList',
	action() {
		BlazeLayout.render('app', {
			main: 'schoolYearsList',
		});
	},
});

FlowRouter.route('/planning/schoolyears/:id/edit', {
	name: 'schoolYearsEdit',
	action() {
		BlazeLayout.render('app', {
			main: 'schoolYearsEdit',
		});
	},
});




// Resources
FlowRouter.route('/planning/resources/list', {
	name: 'resourcesList',
	action() {
		BlazeLayout.render('app', {
			main: 'resourcesList',
		});
	},
});

FlowRouter.route('/planning/resources/new', {
	name: 'resourcesNew',
	action() {
		BlazeLayout.render('app', {
			main: 'resourcesNew',
		});
	},
});

FlowRouter.route('/planning/resources/:id/edit', {
	name: 'resourcesEdit',
	action() {
		BlazeLayout.render('app', {
			main: 'resourcesEdit',
		});
	},
});




// Resources
FlowRouter.route('/planning/subjects/list', {
	name: 'subjectsList',
	action() {
		BlazeLayout.render('app', {
			main: 'subjectsList',
		});
	},
});

FlowRouter.route('/planning/subjects/new', {
	name: 'subjectsNew',
	action() {
		BlazeLayout.render('app', {
			main: 'subjectsNew',
		});
	},
});

FlowRouter.route('/planning/subjects/:id/edit', {
	name: 'subjectsEdit',
	action() {
		BlazeLayout.render('app', {
			main: 'subjectsEdit',
		});
	},
});




// Students
FlowRouter.route('/planning/students/list', {
	name: 'studentsList',
	action() {
		BlazeLayout.render('app', {
			main: 'studentsList',
		});
	},
});

FlowRouter.route('/planning/students/new', {
	name: 'studentsNew',
	action() {
		BlazeLayout.render('app', {
			main: 'studentsNew',
		});
	},
});

FlowRouter.route('/planning/students/:id/edit', {
	name: 'studentsEdit',
	action() {
		BlazeLayout.render('app', {
			main: 'studentsEdit',
		});
	},
});







