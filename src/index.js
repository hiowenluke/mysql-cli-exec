
const shell = require('shelljs');

const me = {
	defaultConfig: null,

	init(config) {
		this.defaultConfig = config;
	},

	getAvailableConfig(config) {
		if (!config) {
			config = this.defaultConfig;
		}

		else

		// If the server config is a host name
		if (typeof config === 'string') {
			const host = config;

			// Use the default config
			config = Object.create(this.defaultConfig);

			// Apply the new host name
			config.host = host;
		}

		return config;
	},

	convertHupToString(config) {
		config = this.getAvailableConfig(config);
		const {host, username, password} = config;
		const hostStr = host ? `-h ${host}` : '';
		return ` ${hostStr} -u${username} -p${password} `;
	},

	getHupString(config) {
		const availableConfig = this.getAvailableConfig(config);
		const str = this.convertHupToString(availableConfig);
		return str;
	},

	createCommands(sqls, config, isReturnArray) {
		const hupString = this.getHupString(config);

		if (typeof sqls === 'string') {
			sqls = [sqls];
		}

		const arr = [];
		sqls.forEach(sql => {
			arr.push(this.createCommand(sql, hupString));
		});

		return isReturnArray ? arr : arr.join(' && ');
	},

	createCommand(sql, config) {
		const hupString = !config ? '' : typeof config === 'string' && /-u/.test(config) ? config : this.convertHupToString(config);
		return `mysql ${hupString} -e "${sql.replace(/"/g, '\\"')}"`;
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

	do(sql, config){
		const commands = this.createCommands(sql, config);
		const out = shell.exec(commands, {silent: true});
		if (out.code !== 0) console.log(out.stderr);

		return this.stdoutToArray(out.stdout);
	},

	exec(...args) {
		return this.do(...args);
	}
};

module.exports = me;
