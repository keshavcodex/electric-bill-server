import express from 'express';
import { login, register, getAllUsers, getUser } from '../services/userServices.js';
import { addConsumer, getConsumer } from '../services/consumerServices.js';

const router = express.Router();

router.get('/', async (req, res) => {
	res.status(200).send('Electrical bill app server up');
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
router.get('/getConsumer/:id', async (req, res) => {
	const response = await getConsumer(req.params.id);
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



router.use('*', (req, res)=>{
	res.send("This route is unavailable");
})

export default router;
