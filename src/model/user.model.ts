import {
    DocumentType,
	Severity,
	getModelForClass,
	modelOptions,
	pre,
	prop,
} from '@typegoose/typegoose';
import { nanoid } from 'nanoid';
import argon2 from 'argon2';
import log from '../utils/logger';


@pre<User>('save', async function () {
	if (!this.isModified('password')) {
		return;
	}
	const hash = await argon2.hash(this.password);
	this.password = hash;
})
@modelOptions({
	// By default adds a timestamp property createdAt and updatedAt to the schema.
	schemaOptions: {
		timestamps: true,
	},
	// By default, if you don't specify a collection name, mongoose takes the name of your model and pluralizes it.
	options: {
		allowMixed: Severity.ALLOW,
	},
})
export class User {
	@prop({ required: true, lowercase: true, unique: true })
	email: string;

	@prop({ required: true })
	name: string;

	@prop({ required: true })
	// accountType could be either "student" or "professional";
	accountType: 'student' | 'professional';

	@prop({ required: true, minlength: 8 })
	password: string;

	@prop({ required: true, default: () => nanoid() })
	verificationCode: string;

	@prop({ required: true })
	passwordResetCode: string | null;

	@prop({ required: true, default: false })
	verified: boolean;

	async validatePassword(this: DocumentType<User>, candidatePassword: string) {
		try {
			return await argon2.verify(this.password, candidatePassword);
		} catch (err) {
			log.error(err, 'Could not verify password');
			return false;
		}
	}
}

const UserModel = getModelForClass(User);

export default UserModel;
