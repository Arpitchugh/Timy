import mongoose from 'mongoose';
import config from 'config';
import log from './logger';

const connectToDB = async () => {
	try {
		await mongoose.connect(config.get('db'));
		log.info('Connected to MongoDB');
	} catch (err: any) {
		console.error(err.message);
		process.exit(1);
	}
};

export default connectToDB;
