import { Request, Response } from 'express';
import { CreateUserInput } from '../schema/user.schema';
import { createUser } from '../service/user.service';
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
