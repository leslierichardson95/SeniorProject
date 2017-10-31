import { Meteor } from 'meteor/meteor';
import './login.html';

// Don't want this code running on the server (only meant for the interface)
if (Meteor.isClient) {
	Template.navLoginInfo.events({
		'click .logout': function(event) {
			event.preventDefault();
			Meteor.logout(function(err) {
				if (err) console.log('Error logging out!');
				Router.go("/"); // redirect to homepage on logout
			});
		}
	});

	Template.signUp.events({
		'submit form': function(event) { //respond to submit event
			event.preventDefault(); //no default behavior
			var firstNameVar = event.target.firstName.value;
			var lastNameVar = event.target.lastName.value;
			var emailVar = event.target.signUpEmail.value;
			var passwordVar = event.target.signUpPassword.value;
			
			// Create a new user with specified information--automatically encrypted using
			// createUser().  Users are logged in after signing up
			Accounts.createUser({
				firstName: firstNameVar,
				lastName: lastNameVar,
				email: emailVar,
				password: passwordVar
			}, function(error){
				if (error) console.log(error.reason);
			});
			Router.go('/'); // redirect to homepage on sign up
		}
	});

	// Template.signUp.onRendered( function() {
	// 	$("#signUp-form").validate();
	// });

	Template.signIn.events({
		'submit form': function(event) {
			event.preventDefault();
			var emailVar = event.target.signInEmail.value;
			var passwordVar = event.target.signInPassword.value;
			Meteor.loginWithPassword(emailVar, passwordVar, function(error){
				if (error) console.log(error.reason);
				Router.go('/'); // redirect to homepage on login
			});
		}
	});
}
