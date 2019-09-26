
# MySQL CLI Exec

A MySQL command-line tool for [Node.js](https://nodejs.org). Execute the MySQL sql statements in CLI, return the result as an object array.



## Installation

Install:
```sh
npm i mysql-cli-exec --save
```

Test:
```sh
git clone https://github.com/hiowenluke/mysql-cli-exec
cd mysql-cli-exec
npm test
```



## Usage

Initialize:
```js
const config = {
    host: '127.0.0.1',
    username: 'root',
    password: 'playboy',
};

const myCli = require('mysql-cli-exec');
myCli.init(config);
```

Exec the sql statements:
```js
const sql = `
    use sys;
    select * from sys_config;
`;
const result = myCli.exec(sql);
```

The result looks like below:
```js
[
    {
        variable: 'diagnostics.allow_i_s_tables',
        value: 'OFF',
        set_time: '2019-09-20 06:53:50',
        set_by: null
    },
    ...
]
```


## Examples

.do(sql)

```js
const sql = `
    use sys;
    select * from sys_config;
`;
const result = myCli.do(sql);
result.length > 0 // true
```

.do(sql, config)
```js
const sql = `
    use sys;
    select * from sys_config;
`;
const result = myCli.do(sql, config);
result.length > 0 // true
```

.do(sql, host)
```js
const sql = `
    use sys;
    select * from sys_config;
`;
const host = 'localhost';
const result = myCli.do(sql, host);
result.length > 0 // true
```

.exec() // The alias of .do()
```js
const sql = `
    use sys;
    select * from sys_config;
`;
const result = myCli.exec(sql); // myCli.do(sql)
result.length > 0 // true
```



## License

[MIT](LICENSE)

Copyright (c) 2019, Owen Luke
