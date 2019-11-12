
const shell = require('shelljs');
const config = require('../__config');
const isOnline = require('./isOnline');

const me = {
	currentServerConfig: null,

	init(serverConfig, myConfig) {
		this.currentServerConfig = serverConfig;

		// In some case, myConfig is included by serverConfig.
		// For simplicity, merge serverConfig and myConfig, then pass it to config.
		config.init(Object.assign({}, serverConfig, myConfig));
	},

	getAvailableConfig(serverConfig) {
		if (!serverConfig) {
			serverConfig = this.currentServerConfig;
		}

		else

		// If the server serverConfig is a host name
		if (typeof serverConfig === 'string') {
			const host = serverConfig;

			// Use the default serverConfig
			serverConfig = Object.create(this.currentServerConfig);

			// Apply the new host name
			serverConfig.host = host;
		}

		if (!serverConfig.port) {
			serverConfig.port = 3306;
		}

		return serverConfig;
	},

	convertHupToString(serverConfig) {
		serverConfig = this.getAvailableConfig(serverConfig);
		const {host, username, password} = serverConfig;
		const hostStr = host ? `-h ${host}` : '';
		return ` ${hostStr} -u${username} -p${password} `;
	},

	getHupString(serverConfig) {
		const availableConfig = this.getAvailableConfig(serverConfig);
		const str = this.convertHupToString(availableConfig);
		return str;
	},

	createCommands(sqls, serverConfig, isReturnArray) {
		const hupString = this.getHupString(serverConfig);

		if (typeof sqls === 'string') {
			sqls = [sqls];
		}

		const arr = [];
		sqls.forEach(sql => {
			arr.push(this.createCommand(sql, hupString));
		});

		return isReturnArray ? arr : arr.join(' && ');
	},

	createCommand(sql, serverConfig) {
		const hupString = !serverConfig ? '' : typeof serverConfig === 'string' && /-u/.test(serverConfig) ? serverConfig : this.convertHupToString(serverConfig);
		sql = sql.replace(/([`"'])/g, '\\$1'); // replace "'" to "\'"
		return `mysql ${hupString} -e "${sql}"`;
	},

	stdoutToArray(stdout) {
		stdout = stdout.replace(/\n+$/, '');
		if (!stdout) return;

		const rows = stdout.split('\n');
		const keys = rows.shift().split('\t');
		const result = [];

		rows.map(row => {
			const cols = row.split('\t');
			const obj = {};
			keys.forEach((key, index) => {
				let val = cols[index];
				obj[key] = val === 'NULL' ? null : val;
			});
			result.push(obj);
		});

		return result;
	},

	do(sql, serverConfig){
		const commands = this.createCommands(sql, serverConfig);
		config.isShowCliCommands && console.log(commands);

		const out = shell.exec(commands, {silent: true});
		if (out.code !== 0) console.log(out.stderr);

		return this.stdoutToArray(out.stdout);
	},

	exec(...args) {
		return this.do(...args);
	},

	async isOnline(serverConfig) {
		const config = this.getAvailableConfig(serverConfig);
		return await isOnline(config.host, config.port);
	},
};

me.config = config;
module.exports = me;
