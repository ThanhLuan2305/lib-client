const errorMessages = {
	9999: "Login failed, please double-check your email and password.",
	1000: "Invalid key error!",
	1001: "Invalid key error!",
	1002: "User already exists!",
	1003: "Invalid email address!",
	1004: "Password must be at least 8 characters long and include letters, numbers, and special characters!",
	1005: "User does not exist!",
	1006: "You are not authenticated!",
	1007: "You do not have permission!",
	1008: "Role does not exist!",
	1009: "This field cannot be blank!",
	1010: "Your email is not verified!",
	1011: "OTP does not exist!",
	1012: "OTP has expired!",
	1013: "New password and confirmation password do not match!",
	1014: "New password must be different from the old password!",
	1015: "Book does not exist!",
	1016: "Book type does not exist!",
	1017: "Book is out of stock!",
	1018: "You have already borrowed this book!",
	1019: "Book not found in borrowing history!",
	1020: "You have returned the book late!",
	1021: "Character length must not exceed 255!",
	1022: "Birth date must be in the past!",
	1023: "Value is out of the allowed range!",
	1024: "This book is currently borrowed and cannot be deleted!",
	1025: "Book already exists!",
	1026: "JWT Token is invalid!",
	1027: "From date must be before to date!",
	1028: "ISBN must be 13 characters!",
	1029: "The uploaded file is empty!",
	1030: "The file is too large! Maximum allowed size is 5MB!",
	1031: "JWT token has expired!",
	1032: "User has been deleted!",
	1033: "User has overdue books and must return them before borrowing new ones!",
	1034: "User has exceeded the maximum allowed late returns!",
	1035: "The user has not borrowed any books!",
	1036: "Logout failed!",
	1037: "Email already exists!",
	1038: "User must change password before logging in!",
	1039: "JTI Token already exists!",
	1040: "Login detail not found!",
	1041: "Phone number must be at least 10 characters!",
	1042: "OTP is invalid or expired!",
	1043: "OTP is duplicated!",
	1044: "User has not verified email or phone number!",
	1045: "Phone number already exists!",
	503: "The system is under maintenance. Please try again later!",
  };
  
  /**
   * Returns the error message based on the error code from the API response
   * @param {number} errorCode - Error code from API
   * @returns {string} - User-friendly error message
   */
  export const getErrorMessage = (errorCode) => {
	return errorMessages[errorCode] || "An unknown error occurred!";
  };
  