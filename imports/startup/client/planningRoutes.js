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



FlowRouter.route('/planning/resources/new', {
	name: 'resourcesNew',
	action() {
		BlazeLayout.render('app', {
			main: 'resourcesNew',
		});
	},
});



FlowRouter.route('/planning/resources/new/book', {
	name: 'resourcesNewBook',
	action() {
		BlazeLayout.render('app', {
			main: 'resourcesNewBook',
		});
	},
});

FlowRouter.route('/planning/resources/new/link', {
	name: 'resourcesNewLink',
	action() {
		BlazeLayout.render('app', {
			main: 'resourcesNewLink',
		});
	},
});

FlowRouter.route('/planning/resources/new/video', {
	name: 'resourcesNewVideo',
	action() {
		BlazeLayout.render('app', {
			main: 'resourcesNewVideo',
		});
	},
});

FlowRouter.route('/planning/resources/new/audio', {
	name: 'resourcesNewAudio',
	action() {
		BlazeLayout.render('app', {
			main: 'resourcesNewAudio',
		});
	},
});

FlowRouter.route('/planning/resources/new/app', {
	name: 'resourcesNewApp',
	action() {
		BlazeLayout.render('app', {
			main: 'resourcesNewApp',
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

FlowRouter.route('/planning/resources/edit/:id', {
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







