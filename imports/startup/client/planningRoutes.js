import _ from 'lodash'

FlowRouter.route('/planning/list', {
	name: 'planningList',
	action() {
		BlazeLayout.render('app', {
			main: 'planningList',
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

FlowRouter.route('/planning/students/view/:id', {
	name: 'studentsView',
	action() {
		BlazeLayout.render('app', {
			main: 'studentsView',
		});
	},
});

FlowRouter.route('/planning/students/edit/:id', {
	name: 'studentsEdit',
	action() {
		BlazeLayout.render('app', {
			main: 'studentsEdit',
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

FlowRouter.route('/planning/schoolyears/view/:id', {
	name: 'schoolYearsView',
	action() {
		BlazeLayout.render('app', {
			main: 'schoolYearsView',
		});
	},
});

FlowRouter.route('/planning/schoolyears/edit/:id', {
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

FlowRouter.route('/planning/resources/new/:type', {
	name: 'resourcesNew',
	action: function(params) {
		BlazeLayout.render('app', {
			main: 'resourcesNew' + _.capitalize(params.type),
		});
	},
});


FlowRouter.route('/planning/resources/view/:id', {
	name: 'resourcesView',
	action() {
		BlazeLayout.render('app', {
			main: 'resourcesView',
		});
	},
});

FlowRouter.route('/planning/resources/edit/:id/:type', {
	name: 'resourcesEdit',
	action: function(params, queryParams) {
		BlazeLayout.render('app', {
			main: 'resourcesEdit' + _.capitalize(params.type),
		});
	},
});




// Subjects
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

FlowRouter.route('/planning/subjects/view/:id', {
	name: 'subjectsView',
	action() {
		BlazeLayout.render('app', {
			main: 'subjectsView',
		});
	},
});

FlowRouter.route('/planning/subjects/edit/:id', {
	name: 'subjectsEdit',
	action() {
		BlazeLayout.render('app', {
			main: 'subjectsEdit',
		});
	},
});




// Notes
// FlowRouter.route('/planning/notes/list', {
// 	name: 'notesList',
// 	action() {
// 		BlazeLayout.render('app', {
// 			main: 'notesList',
// 		});
// 	},
// });

// FlowRouter.route('/planning/notes/new', {
// 	name: 'notesNew',
// 	action() {
// 		BlazeLayout.render('app', {
// 			main: 'notesNew',
// 		});
// 	},
// });

// FlowRouter.route('/planning/notes/view/:id', {
// 	name: 'notesId',
// 	action() {
// 		BlazeLayout.render('app', {
// 			main: 'notesId',
// 		});
// 	},
// });

// FlowRouter.route('/planning/notes/edit/:id', {
// 	name: 'subjectsEdit',
// 	action() {
// 		BlazeLayout.render('app', {
// 			main: 'notesEdit',
// 		});
// 	},
// });







