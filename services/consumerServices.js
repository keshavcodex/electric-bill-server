import { consumerCollection } from '../schema/schema.js';
import { formatBillMonth } from '../util/helper.js';

export const addConsumer = async (data) => {
	try {
		const { conId, name, bill, LK, billMonth } = data;

		// Format the billMonth
		const formattedBillMonth = formatBillMonth(billMonth);

		const previousConsumer = await consumerCollection.findOne({
			conId
		});

		if (previousConsumer) {
			// Updating previous consumer
			const response = await consumerCollection.updateOne(
				{ _id: previousConsumer._id },
				{ $set: { bill, name, LK, billMonth: formattedBillMonth } }
			);
			return { data: response, statusCode: 200 };
		} else {
			// Saving new consumer
			const newConsumer = new consumerCollection({
				...data,
				billMonth: formattedBillMonth
			});
			const response = await newConsumer.save();
			return { data: response, statusCode: 200 };
		}
	} catch (error) {
		return { data: 'Consumer addition failed', statusCode: 500 };
	}
};

export const addAllConsumers = async (consumersData) => {
	try {
		// Format and prepare data for upsert
		const bulkOps = consumersData.map((data) => ({
			updateOne: {
				filter: { conId: data.conId }, // Check for existing record based on unique field
				update: {
					$set: data
				},
				upsert: true // Insert if the record does not exist
			}
		}));

		// Execute bulk operation
		const result = await consumerCollection.bulkWrite(bulkOps, {
			ordered: false
		});

		return { data: result, statusCode: 200 };
	} catch (error) {
		console.error('Error adding all consumers:', error);
		return { data: 'Consumer addition failed', statusCode: 500 };
	}
};

export const getConsumer = async (input) => {
	try {
		// Check if the input is a number
		const isNumeric = /^\d+$/.test(input);

		// Create a regex for partial matching
		const regex = new RegExp(input.toString(), 'i'); // 'i' makes it case-insensitive

		// Determine the search field based on input type
		const searchField = isNumeric ? 'conId' : 'name';

		// Find the consumer by either conId or name
		const consumer = await consumerCollection.find({
			[searchField]: { $regex: regex }
		}).sort({ [sortField]: 1 });

		return { data: consumer, statusCode: 200 };
	} catch (error) {
		console.log(error);
		return { data: 'Consumer not found', statusCode: 403 };
	}
};

export const deleteConsumerByDate = async (date) => {
	try {
		// Convert the start and end date strings to Date objects
		const startDate = new Date(date.start).toISOString();
		const endDate = new Date(date.end).toISOString();

		// Delete documents within the specified date range
		const result = await consumerCollection.deleteMany({
			lastUpdated: {
			  $gte: startDate,
			  $lt: endDate,
			},
		});
		console.log(`${result.deletedCount} documents were deleted.`);
		return { data: result, statusCode: 200 };
	} catch (error) {
		console.error('Error deleting documents:', error);
		return { data: 'documents not deleted correctly.', statusCode: 500 };
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
