import { Request, Response } from 'express';
import {
	CreateUserInput,
	ForgotPasswordInput,
	VerifyUserInput,
} from '../schema/user.schema';
import { createUser, findUserByEmail, findUserById } from '../service/user.service';
import { User } from '../model/user.model';
import sendEmail from '../utils/mailer';

export async function createUserHandler(
	req: Request<{}, {}, CreateUserInput>,
	res: Response
) {
	const body = req.body;

	try {
		const user = await createUser(body as Partial<User>);
		await sendEmail({
			from: 'arpitchugh@gmail.com',
			to: user.email,
			subject: 'Verify your email',
			text: `Verify your email using Verification Code: ${user.verificationCode}, Id: ${user._id}`,
		});
		return res.send('User created successfully');
	} catch (error: any) {
		if (error.code === 11000) {
			return res.status(409).send('User already exists');
		}
		return res.status(500).send(error.message);
	}
}

export async function verifyUserHandler(
	req: Request<VerifyUserInput>,
	res: Response
) {
	const id = req.params.id;
	const verificationCode = req.params.verificationCode;
	// find user by id
	const user = await findUserById(id);
	if (!user) {
		return res.status(404).send('User not found');
	}
	// check if they are already verified
	if (user.verified) {
		return res.send('User already verified');
	}
	// check if verification code matches
	if (user.verificationCode === verificationCode) {
		// if yes, update user to be verified
		await user.updateOne({ verified: true });
		return res.send('User successfully verified');
	}
	// if verification code does not match, return 400
	return res.status(400).send('Invalid verification code');
}

export async function forgotPasswordHandler(
	req: Request<{}, {}, ForgotPasswordInput>,
	res: Response
) {
	const { email } = req.body;
	const user = await findUserByEmail(email);
	if (!user) {
		return res.status(404).send('User not found');
	}
	await sendEmail({
		from: 'arpiitchugh@gmail.com',
		to: user.email,
		subject: 'Reset your password',
		text: `Reset your password using Verification Code: ${user.verificationCode}, Id: ${user._id}`,
	});
	return res.send('Password reset email sent');
}
