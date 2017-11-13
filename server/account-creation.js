Accounts.onCreateUser(function(options, user) {
	// Use provided profile in options, or create an empty object
	user.profile = options.profile || {};

	// Assigns first and last names to newly created object
	user.profile.firstName = options.firstName;
	user.profile.lastName = options.lastName;
	user.profile.phoneNumber = options.phoneNumber;

	// Returns the user object
	return user;
});