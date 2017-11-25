Router.route('/', {
	name: 'homePage',
	template: 'homePage'
});

Router.route('/signUp', {
	name: 'signUpPage',
	template: 'signUpPage'
});

Router.route('/signIn', {
	name: 'signInPage',
	template: 'signInPage',
});

Router.route('/myClubs', {
	name: 'myClubsPage',
	template: 'myClubsPage',
});

Router.route('/about', {
	name: 'about',
	template: 'about'
});

Router.route('/CalPage', {
	name: 'CalPage',
	template: 'CalPage'
});

Router.route('/myProfile', {
	name: 'myProfilePage',
	template: 'myProfilePage'
});

Router.route('/inviteCode', {
	name: 'inviteCodePage',
	template: 'inviteCodePage'
});

Router.route('/clubSiteHome', {
	name: 'clubSiteHome',
	template: 'clubSiteHome'
});

Router.route('/members', {
	name: 'membersPage',
	template: 'membersPageWrapper'
});

Router.route('/pendingMembers', {
	name: 'pendingMembers',
	template: 'pendingMembersTableWrapper'
});

Router.route('/joinRequests', {
	name: 'joinRequests',
	template: 'joinRequestsWrapper'
});

Router.route('/requirements', {
	name: 'requirementsPage',
	template: 'requirementsPageWrapper'
});

Router.route('/clubEvents', {
	name: 'eventsPage',
	template: 'eventsPageWrapper'
});

Router.route('/eventSignUps', {
	name: 'eventSignUpPage',
	template: 'eventSignUpPageWrapper'
});

Router.route('/attendance', {
	name: 'attendancePage',
	template: 'attendancePageWrapper'
});

Router.route('/eventLogs', {
	name: 'eventLogsPage',
	template: 'eventLogsPageWrapper'
});

Router.route('/requirementLogs', {
	name: 'requirementLogsPage',
	template: 'requirementLogsPageWrapper'
});

Router.route('/search', {
	name: 'search',
	template: 'search'
});
