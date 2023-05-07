# User

The user model is the main model for the application. It contains all the information about the user.

## User Model
- email: Required, unique, email, lowerCase
- name: Required, String
- accountType: **student** or **professional** no other option
- password: Required, String, min 8 characters
- verificationCode: String
- passwordResetCode: String
- verified: Boolean, default: false, required: true