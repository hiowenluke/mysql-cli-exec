
const me = {
	isShowCliCommands: false,

	init(...args) {
		this.set(...args);
	},

	set(config) {
		Object.assign(this, config);
	},

	get() {
		const data = {};
		Object.keys(this).forEach(key => {
			if (typeof this[key] === 'function') return;
			data[key] = this[key];
		});
		return data;
	}
};

module.exports = me;
