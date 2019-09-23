
const expect = require('chai').expect;
const myCli = require('../src');

const config = {
	host: '127.0.0.1',
	username: 'root',
	password: 'playboy',
};

describe('MySql CLI Exec', () => {
	myCli.init(config);

	it(`.do(sql)`, async () => {
		const sql = `
			use sys;
			select * from sys_config;
		`;
		const result = myCli.do(sql);
		expect(Object.keys(result[0]).length > 0).to.be.true;
	});

	it(`.do(sql, config)`, async () => {
		const sql = `
			use sys;
			select * from sys_config;
		`;
		const result = myCli.do(sql, config);
		expect(Object.keys(result[0]).length > 0).to.be.true;
	});

	it(`.do(sql, host)`, async () => {
		const sql = `
			use sys;
			select * from sys_config;
		`;
		const host = 'localhost';
		const result = myCli.do(sql, host);
		expect(Object.keys(result[0]).length > 0).to.be.true;
	});

	it(`.exec() // The alias of .do()`, async () => {
		const sql = `
			use sys;
			select * from sys_config;
		`;
		const result = myCli.exec(sql); // myCli.do(sql)
		expect(Object.keys(result[0]).length > 0).to.be.true;
	});

});
