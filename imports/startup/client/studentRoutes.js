FlowRouter.route('/students/new', {
	name: 'studentsNew',
	action() {
		BlazeLayout.render('app', {
			main: 'studentsNew',
		});
	},
});

FlowRouter.route('/students/list', {
	name: 'studentsList',
	action() {
		BlazeLayout.render('app', {
			main: 'studentsList',
		});
	},
});

FlowRouter.route('/students/:id', {
	name: 'studentsId',
	action() {
		BlazeLayout.render('app', {
			main: 'studentsId',
		});
	},
});







