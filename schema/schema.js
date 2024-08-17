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
	bill: {
		type: Number,
		required: true
	},
	billMonth: {
		type: 'string',
		default: ''
	},
	LK: {
		type: 'string'
	},
	lastUpdated: {
		type: String,
		default: () => new Date().toISOString()
	}
};

export const consumerCollection = mongoose.model('consumer', consumer);
