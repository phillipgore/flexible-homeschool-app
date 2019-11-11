Inject.rawBody("loader", Assets.getText('loading.html'));

let gaInit = '';
let gaEvent = '';
if (Meteor.settings.public.mode === 'prod') {
	gaInit = `
	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script async="" src="https://www.googletagmanager.com/gtag/js?id=${Meteor.settings.public.googleAnalytics.trackingId}"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments)};
		gtag('js', new Date());
		gtag('config', '${Meteor.settings.public.googleAnalytics.trackingId}');
		gtag('config', 'AW-1070645351');
	</script>`;
}

Picker.route('/verify/sent', (params, req, res, next) => {
	if (Meteor.settings.public.mode === 'prod') {
		gaEvent = `
		<!-- Event snippet for Completed Sign Up Process conversion page -->
		<script>
			gtag('event', 'conversion', {
				'send_to': 'AW-1070645351/pYf5CMDbz7MBEOeAw_4D',
				'transaction_id': ''
			});
		</script>`;

		Inject.rawHead('GoogleAnalytics', gaEvent);
	}
	next();
});

Inject.rawHead('GoogleAnalytics', gaInit);


import { ReactiveVar } from 'meteor/reactive-var';
import './browser-policy.js';
import './accounts.js';
import './admin.js';
import './stripe.js';
import './mailchimp.js';
import './migrations.js';
import './endpoints.js';
import './fixtures.js';
import './cron.js';

import '../../api/groups/groups.js';
import '../../api/groups/methods.js';
import '../../api/groups/server/publications.js';

import '../../api/lessons/lessons.js';
import '../../api/lessons/methods.js';
import '../../api/lessons/server/publications.js';

import '../../api/notes/notes.js';
import '../../api/notes/methods.js';
import '../../api/notes/server/publications.js';

import '../../api/office/methods.js';
import '../../api/office/server/publications.js';

import '../../api/paths/paths.js';
import '../../api/paths/methods.js';
import '../../api/paths/server/publications.js';

import '../../api/reports/reports.js';
import '../../api/reports/methods.js';
import '../../api/reports/server/publications.js';

import '../../api/resources/resources.js';
import '../../api/resources/methods.js';
import '../../api/resources/server/publications.js';

import '../../api/schoolWork/schoolWork.js';
import '../../api/schoolWork/methods.js';
import '../../api/schoolWork/server/publications.js';

import '../../api/schoolYears/schoolYears.js';
import '../../api/schoolYears/methods.js';
import '../../api/schoolYears/server/publications.js';

import '../../api/stats/stats.js';
import '../../api/stats/methods.js';
import '../../api/stats/server/publications.js';

import '../../api/students/students.js';
import '../../api/students/methods.js';
import '../../api/students/server/publications.js';

import '../../api/users/methods.js';
import '../../api/users/server/publications.js';

import '../../api/terms/terms.js';
import '../../api/terms/methods.js';
import '../../api/terms/server/publications.js';

import '../../api/weeks/weeks.js';
import '../../api/weeks/methods.js';
import '../../api/weeks/server/publications.js';
