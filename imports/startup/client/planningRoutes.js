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

FlowRouter.route('/planning/students/:id', {
	name: 'studentsId',
	action() {
		BlazeLayout.render('app', {
			main: 'studentsId',
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

FlowRouter.route('/planning/schoolyears/:id', {
	name: 'schoolYearsId',
	action() {
		BlazeLayout.render('app', {
			main: 'schoolYearsId',
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

FlowRouter.route('/planning/resources/:id', {
	name: 'resourcesId',
	action() {
		BlazeLayout.render('app', {
			main: 'resourcesId',
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

FlowRouter.route('/planning/subjects/:id', {
	name: 'subjectsId',
	action() {
		BlazeLayout.render('app', {
			main: 'subjectsId',
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

// FlowRouter.route('/planning/notes/:id', {
// 	name: 'notesId',
// 	action() {
// 		BlazeLayout.render('app', {
// 			main: 'notesId',
// 		});
// 	},
// });

// FlowRouter.route('/planning/notes/:id/edit', {
// 	name: 'subjectsEdit',
// 	action() {
// 		BlazeLayout.render('app', {
// 			main: 'notesEdit',
// 		});
// 	},
// });







