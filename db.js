import mongoose from 'mongoose';

const connection = async (mongourl) => {
	if (!mongourl) {
		throw new Error('Missing MONGODB_URL environment variable.');
	}

	mongoose.set('strictQuery', true);

	try {
		await mongoose.connect(mongourl);
		console.log('Database connected successfully.');
	} catch (error) {
		console.error('Error connecting to database:', error);
		throw error; 
	}
};

process.on('SIGINT', () => {
	mongoose.connection.close(() => {
		console.log('Database connection closed.');
		process.exit(0);
	});
});

export default connection;
