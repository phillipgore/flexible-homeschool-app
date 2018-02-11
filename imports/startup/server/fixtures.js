import {Plans} from '../../api/plans/plans';

const plans = [
	{
		planId: 'standard',
		label: 'Standard',
		price: 1000,
	}
];

plans.forEach((plan) => {
	const planExists = Plans.findOne({ planId: plan.planId });
	if (!planExists) Plans.insert(plan);
});
