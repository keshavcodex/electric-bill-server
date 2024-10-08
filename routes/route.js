import express from 'express';
import {
	login,
	register,
	getAllUsers,
	getUser
} from '../services/userServices.js';
import {
	addConsumer,
	getConsumer,
	addAllConsumers,
	deleteConsumerByDate,
	renameFields,
	addFields
} from '../services/consumerServices.js';
import { excelReader } from '../services/excelReader.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', async (req, res) => {
	res.status(200).send('Electrical bill app server up');
});
router.post('/fetchExcel', upload.single('file'), async (req, res) => {
	if (!req.file) {
		return res.status(400).send('No file uploaded.');
	}
	const response = await excelReader(req.file.path);
	res.status(200).json(response);
});
router.post('/login', async (req, res) => {
	const response = await login(req.body);
	res.status(response.statusCode).send(response.data);
});
router.post('/register', async (req, res) => {
	const response = await register(req.body);
	res.status(response.statusCode).send(response.data);
});
router.get('/getUser/:id', async (req, res) => {
	const response = await getUser(req.params.id);
	res.status(response.statusCode).send(response.data);
});
router.get('/getAllUsers', async (req, res) => {
	const response = await getAllUsers();
	res.status(response.statusCode).send(response.data);
});

// Consumer app
router.post('/addConsumer', async (req, res) => {
	const response = await addConsumer(req.body);
	res.status(response.statusCode).send(response.data);
});
router.post('/addAllConsumers', async (req, res) => {
	const response = await addAllConsumers(req.body);
	res.status(response.statusCode).send(response.data);
});
router.post('/getConsumer', async (req, res) => {
	const response = await getConsumer(req.body.search);
	res.status(response.statusCode).send(response.data);
});
router.post('/deleteConsumerByDate', async (req, res) => {
	const response = await deleteConsumerByDate(req.body);
	res.status(response.statusCode).send(response.data);
});
router.get('/renameFields', async (req, res) => {
	const response = await renameFields();
	console.log(response);
	res.status(response.statusCode).send(response.data);
});
router.post('/addFields', async (req, res) => {
	const response = await addFields(req.body);
	console.log(response);
	res.status(response.statusCode).send(response.data);
});
// router.get('/getAllConsumer/:id', async (req, res) => {
// 	const response = await getAllConsumer(req.params.id);
// 	res.status(response.statusCode).send(response.data);
// });
// router.get('/getAllConsumer', async (req, res) => {
// 	const response = await getAllConsumerFromDB();
// 	res.status(response.statusCode).send(response.data);
// });
// router.delete('/deleteConsumer/:id', async (req, res) => {
// 	const response = await deleteConsumer(req.params.id);
// 	res.status(response.statusCode).send(response.data);
// });

router.use('*', (req, res) => {
	res.send('This route is unavailable');
});

export default router;
