import _ from 'lodash';


// Redirect based on user role.
function checkRoleUser(context, redirect) {
	if (Meteor.user().info.role === 'User') {
		if (_.startsWith(context.route.name, 'users') || _.startsWith(context.route.name, 'billing')) {
			redirect('/settings/support/view/1');
		}
	}
};

FlowRouter.triggers.enter([checkRoleUser], {only: [
	'usersList',
	'usersNew',
	'usersVerifySent',
	'usersView',
	'usersEdit',
	'billingList',
	'billingInvoices',
	'billingPause',
	'billingEdit',
	'billingCoupons',
]});