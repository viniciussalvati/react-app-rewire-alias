# react-app-rewire-alias
Add your own alias to packages so you don't have to type "../" a hundred times

## Usage

```javascript
module.exports = require('react-app-rewire-alias')({
	alias: {
		'@app': '~/src',
		'@components': '~/src/components'
	}
});

// or

module.exports = function override(config, env) {

	//do stuff with the webpack config...
	const rewire = react_app_rewired.compose(
		//...
		require('react-app-rewire-alias')({
			alias: {
				'@app': '~/src',
				'@components': '~/src/components'
			}
		})
		//...
		),
	);

	return rewire(config, env);
};

```

## For Typescript users

We usually have to configure our tsconfig.json so that alias can work, so we have an option to read the tsconfig.json file.

The following setup is equivalent to the one above.

tsconfig.json:
```json
{
	"compilerOptions":{
		// other options
		"paths": {
			"@app/*": [
				"./src/*"
			],
			"@components/*": [
				"./src/components/*"
			]
		}
	}
}
```


```javascript
module.exports = require('react-app-rewire-alias').fromTsConfig();
```