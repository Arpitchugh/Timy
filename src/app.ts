require('dotenv').config();
import express from 'express';
import config from 'config';
import connectToDB from './utils/connectToDB';
import log from './utils/logger';
import router from './routes';

const app = express();

app.use(express.json());
app.use(router);

const PORT = config.get('port') || 3000;
app.listen(PORT, () => {
	log.info(`Server is running on port ${PORT}`);
	connectToDB();
});
