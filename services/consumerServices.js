import { consumerCollection } from '../schema/schema.js';

export const addConsumer = async (data) => {
	try {
		const { conId, name, bill, LK } = data;

		const previousConsumer = await consumerCollection.findOne({
			conId
		});

		console.log('previousConsumer', previousConsumer, '\n');
		console.log('new data to feed', data);
		if (previousConsumer) {
			//updating previous weight
			const response = await consumerCollection.updateOne(
				{ _id: previousConsumer._id },
				{ $set: { bill, name, LK } }
			);
			return { data: response, statusCode: 200 };
		} else {
			// saving new weight
			const newConsumer = new consumerCollection(data);
			const response = await newConsumer.save();
			return { data: response, statusCode: 200 };
		}
	} catch (error) {
		return { data: 'Consumer addition failed', statusCode: 500 };
	}
};

export const getConsumer = async (conId) => {
	try {
		// Convert conId to string and use regex for partial match
		const regex = new RegExp(conId.toString());

		// Find the consumer by partial conId
		const consumer = await consumerCollection.find({
			conId: { $regex: regex }
		});

		return { data: consumer, statusCode: 200 };
	} catch (error) {
		console.log(error);
		return { data: 'Consumer not found', statusCode: 403 };
	}
};

// export const getAllConsumer = async (conId) => {
// 	try {
// 		const usersWeight = await weight.find({ conId }, null, {
// 			sort: { selectedDate: -1 }
// 		});
// 		return { data: usersWeight, statusCode: 200 };
// 	} catch (error) {
// 		console.log(error);
// 		return { data: 'user not found', statusCode: 403 };
// 	}
// };
// export const getAllConsumerFromDB = async () => {
// 	try {
// 		const usersWeight = await weight.find();
// 		console.log(usersWeight);
// 		return { data: usersWeight, statusCode: 200 };
// 	} catch (error) {
// 		console.log(error);
// 		return { data: 'user not found', statusCode: 403 };
// 	}
// };
// export const deleteConsumer = async (weightId) => {
// 	try {
// 		const deleteInfo = await weight.deleteOne({ _id: weightId });
// 		console.log('deleteInfo', deleteInfo);
// 		return { data: `${weightId} deleted successfully.`, statusCode: 200 };
// 	} catch (error) {
// 		console.log(error);
// 		return { data: `${weightId} deletion failed!`, statusCode: 403 };
// 	}
// };
// export const updatedconId = async (data) => {
// 	console.log('data', data);
// 	try {
// 		const response = await weight.updateMany(
// 			{ conId: data.oldId },
// 			{ $set: { conId: data.newId } }
// 		);
// 		// const response = await weight.find({ conId: data.oldId });

// 		return { data: response, statusCode: 200 };
// 	} catch (error) {
// 		console.log('error while updating conId');
// 		return { data: 'failed to update conId', statusCode: 500 };
// 	}
// };
