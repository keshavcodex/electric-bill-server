import * as XLSX from 'xlsx/xlsx.mjs';
import * as fs from 'fs';
import { Readable } from 'stream';
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
import { toTitleCase } from '../util/helper.js';

// Set up fs and stream support
XLSX.set_fs(fs);
XLSX.stream.set_readable(Readable);
XLSX.set_cptable(cpexcel);

export const excelReader = async (filePath) => {
	try {
		const data = await fs.promises.readFile(filePath);
		// Read the Excel file into a workbook object
		const workbook = XLSX.read(data, { type: 'buffer' });

		// Get the first sheet from the workbook
		const firstSheetName = workbook.SheetNames[0];
		const firstSheet = workbook.Sheets[firstSheetName];

		// Convert the sheet to JSON format
		const jsonData = XLSX.utils.sheet_to_json(firstSheet);

		// Convert each field to a string
		const jsonDataConversion = jsonData.map((row) => {
			const stringRow = {};
			for (const [key, value] of Object.entries(row)) {
				stringRow[key] = toTitleCase(value);
			}

			if (stringRow['CONSUMER_NAME']) {
				stringRow['name'] = `${stringRow['CONSUMER_NAME']} ${
					stringRow['FATHER_HUSBAND_NAME']
						? `S/W ${stringRow['FATHER_HUSBAND_NAME']}`
						: ''
				}`.trim();
			}

			stringRow['conId'] = stringRow['CONSUMER_ID'] || stringRow['conId'];
			stringRow['book'] = stringRow['BOOK_NUMBER'] || stringRow['book'];
			stringRow['category'] = stringRow['CATEGORY'] || stringRow['category'];

			delete stringRow['CONSUMER_NAME'];
			delete stringRow['FATHER_HUSBAND_NAME'];
			delete stringRow['CONSUMER_ID'];
			delete stringRow['BOOK_NUMBER'];
			delete stringRow['CATEGORY'];

			return stringRow;
		});
		return jsonDataConversion;
	} catch (error) {
		console.log(error);
		return { data: 'Error processing file', statusCode: 400 };
	}
};
