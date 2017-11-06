import { Meteor } from 'meteor/meteor';
import './login.html';

// Don't want this code running on the server (only meant for the interface)
if (Meteor.isClient) {
	Template.navLoginInfo.helpers({
		firstName: function() {
			return Meteor.user().profile.firstName;
		}
	});

	Template.navLoginInfo.events({
		'click .logout': function(event) {
			event.preventDefault();
			Meteor.logout(function(error) {
				if (error) {
					return swal({
						title: error.reason,
						text: "Please try again",
						showConfirmButton: true,
						type: "error"
					});
				}
				else Router.go("/"); // redirect to homepage on logout
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
			var confirmPasswordVar = event.target.confirmPassword.value;

			var isValidPassword = function(pwd1, pwd2) {
				if (pwd1 !== pwd2) {
					swal({
						title: "Passwords don't match",
						text: "Please try again",
						showConfirmButton: true,
						type: "error"
					});
					return false;
				}
				else return true;
			}
		
			// Create a new user with specified information--automatically encrypted using
			// createUser().  Users are logged in after signing up
			if (isValidPassword(passwordVar, confirmPasswordVar) === true) {
				Accounts.createUser({
					firstName: firstNameVar,
					lastName: lastNameVar,
					email: emailVar,
					password: passwordVar
				}, function(error){
					if (error) {
						return swal({
							title: error.reason,
							text: "Please try again",
							showConfirmButton: true,
							type: "error"
						});
						console.log(error.reason);
					}
					else Router.go('/'); // redirect to homepage on sign up
				});
			}

		}
	});

	Template.signIn.events({
		'submit form': function(event) {
			event.preventDefault();
			var emailVar = event.target.signInEmail.value;
			var passwordVar = event.target.signInPassword.value;
			Meteor.loginWithPassword(emailVar, passwordVar, function(error){
				if (error) {
					return swal({
						title: error.reason,
						text: "Please try again",
						showConfirmButton: true,
						type: "error"
					});
				}
				else Router.go('/'); // redirect to homepage on login
			});
		}
	});
}
