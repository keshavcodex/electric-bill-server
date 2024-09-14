import { consumerCollection } from '../schema/schema.js';
import { formatReadingMonth } from '../util/helper.js';

export const addConsumer = async (data) => {
	try {
		const { conId, name, reading, status, readingMonth, book, category } = data;

		// Format the readingMonth
		const formattedReadingMonth = formatReadingMonth(readingMonth);

		// Use findOneAndUpdate with upsert option to update or insert the consumer
		const response = await consumerCollection.findOneAndUpdate(
			{ conId },
			{
				$set: {
					name,
					reading,
					status,
					readingMonth: formattedReadingMonth,
					book,
					category
				}
			},
			{ new: true, upsert: true } // `new: true` returns the updated document, `upsert: true` inserts if not found
		);
		return { data: response, statusCode: 200 };
	} catch (error) {
		console.error('Error adding/updating consumer:', error);
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
		const regex = new RegExp(`\\b${input.toString().trim()}`, 'i'); // 'i' makes it case-insensitive

		// Determine the search field based on input type
		const searchField = isNumeric ? 'conId' : 'name';

		// Find the consumer by either conId or name
		const consumer = await consumerCollection
			.find({
				[searchField]: { $regex: regex }
			})
			.sort({ name: 1 });

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
				$lt: endDate
			}
		});
		console.log(`${result.deletedCount} documents were deleted.`);
		return { data: result, statusCode: 200 };
	} catch (error) {
		console.error('Error deleting documents:', error);
		return { data: 'documents not deleted correctly.', statusCode: 500 };
	}
};

export const renameFields = async () => {
	try {
		const response = await consumerCollection.updateMany(
			{}, // Match all documents
			{
				$rename: {
					bill: 'reading',
					billMonth: 'readingMonth',
					LK: 'status'
				}
			}
		);
		console.log('Fields renamed successfully:', JSON.stringify(response));
		return response.acknowledged
			? { data: 'Fields renamed successfully', statusCode: 200 }
			: {
					data: 'Fields renamed failed',
					statusCode: 501
			  };
	} catch (error) {
		console.error('Error renaming fields:', error);
		return { data: 'Field renaming failed', statusCode: 500 };
	}
};

export const addFields = async (body) => {
	try {
		const fieldsArray = body?.fieldsString.split(',').map((str) => str.trim());
		const updateObject = {};
		fieldsArray.forEach(key => {
            if (key) {
                updateObject[key] = ""; // Set the default value (empty string) for each key
            }
        });
		// Update all documents with the parsed fields
		await consumerCollection.updateMany(
			{}, // Match all documents
			{
				$set: updateObject
			}
		);

		console.log('Fields updated successfully.');
		return { data: 'Fields updated successfully', statusCode: 200 };
	} catch (error) {
		console.error('Error updating fields:', error);
		return { data: 'Error updating fields', statusCode: 500 };
	}
};
