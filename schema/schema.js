import mongoose from 'mongoose';

const userSchema = {
	type: 'object',
	firstName: {
		type: 'string',
		required: true,
		minLength: 2
	},
	lastName: {
		type: 'string',
		required: true,
		minLength: 2
	},
	email: {
		type: 'string',
		required: true,
		unique: true,
		match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	},
	password: {
		type: 'string',
		required: true,
		minLength: 6
	},
	phone: {
		type: 'string',
		pattern: '^+[d]{1,2}-d{10}$',
		required: true
	},
	lastUpdated: {
		type: String,
		default: () => new Date().toISOString()
	}
};

export const user = mongoose.model('user', userSchema);

const consumer = {
	type: 'object',
	conId: {
		type: 'string',
		required: true
	},
	name: {
		type: 'string',
		default: ''
	},
	reading: {
		type: Number,
		default: 0
	},
	readingMonth: {
		type: 'string',
		default: ''
	},
	category: {
		type: 'string',
		default: ''
	},
	book: {
		type: 'string',
		default: ''
	},
	status: {
		type: 'string',
		default: 'Ok'
	},
	lastUpdated: {
		type: String,
		default: () => new Date().toISOString()
	}
};

export const consumerCollection = mongoose.model('consumer', consumer);
