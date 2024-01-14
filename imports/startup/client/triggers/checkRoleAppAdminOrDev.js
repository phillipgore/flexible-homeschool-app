import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Redirection based on App Admin or Dev role.
function checkRoleAppAdminOrDev (context, redirect) {
	if (Meteor.user().info.role === 'Application Administrator' || Meteor.user().info.role === 'Developer') {
		redirect('/settings/support/view/1');
	} 
};

FlowRouter.triggers.enter([checkRoleAppAdminOrDev], {only: [
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