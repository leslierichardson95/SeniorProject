import { Meteor } from 'meteor/meteor';
if (Meteor.isServer) {
	Meteor.methods({
		'emailInvite': function(name, email, clubName, clubSiteId, inviteCode) {
			Email.send({
				from: 'postmaster@sandbox66c393fbdd0e4f7dabb9581c7adfcaed.mailgun.com',
				to: email,
				subject: 'Gator Club Manager: Invite to join a club!',
				html: '<p>' + name + ',<br><br>You have received an invitation to become a member of <strong>' + clubName + 
				'</strong> on Gator Club Manager! Your invite code is: <strong>' + inviteCode + 
				'</strong>. Click <a href="http://localhost:3000/signUp#upmark">here </a>' +
				'to login/sign-up to the site and select your name at the top of the home screen to enter your invite code. </p>'
			});

			// store generated invite code until the invitee uses it
			Meteor.call('inviteCodes.insert', inviteCode, clubSiteId, name, email);
		}
	});
}