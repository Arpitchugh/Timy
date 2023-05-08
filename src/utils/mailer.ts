import config from 'config';
import nodemailer, { SendMailOptions } from 'nodemailer';
import log from './logger';

// async function createTestCredentials() {
// 	const credentials = await nodemailer.createTestAccount();
// 	console.log({ credentials });
// }
// createTestCredentials();

const smtp = config.get<{
	user: string;
	pass: string;
	host: string;
	port: number;
	secure: boolean;
}>('smtp');

const transporter = nodemailer.createTransport({
	...smtp,
	auth: {
		user: smtp.user,
		pass: smtp.pass,
	},
});

async function sendEmail(payload: SendMailOptions) {
	transporter.sendMail(payload, (err, info) => {
		if (err) {
			log.error(`Error occurred. ${err.message}`);
			return process.exit(1);
		}
		log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
	});
}

export default sendEmail;
