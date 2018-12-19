// CC infor reset.
function resetSessions(context) {
	Session.set({
		card: '',
		hideCoupon: false,
		cardNumber: 'none',
		cardCvc: 'none',
		cardExpiry: 'none',
		postalCode: 'none',
		coupon: ''
	});
};

FlowRouter.triggers.enter([resetSessions], {except: [
	'usersView',
	'usersNew',
	'usersVerifyResent',
	'usersEdit',
	'usersRestricted',
	'billingError',
	'billingInvoices',
	'billingEdit',
	'billingCoupons',
	'supportView',
	'usersView',
]});