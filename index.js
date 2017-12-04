//@ts-check

const path = require('path');
const { mapKeys, mapValues, forIn } = require('lodash');

/**
 * @typedef AliasOptions
 * @prop {*} alias An dictionary of an alias with a source mapping to paths. Ex: { '@app': '~/src' }
 * Every path starting with ~/ will be passed through `path.resolve`
 */

/**
 *
 * @param {AliasOptions} options
 */
const rewireAlias = function(options) {
	return (config, env) => {
		const resolve = config.resolve = config.resolve || {};

		const alias = resolve.alias = resolve.alias || {};

		const rootRegex = /^\~\//;
		forIn(options.alias, (value, key) => {
			if(rootRegex.test(value)) {
				value = path.resolve(value.replace(rootRegex, './'));
			}

			alias[key] = value;
		})

		return config;
	}
}

/**
 * @typedef TsConfigOptions
 * @prop {string} [tsConfigPath] The absolute path of the tsconfig.json
 * @prop {*} [tsConfig] The value of the tsconfig.json, loaded by require() or by building it by hand.
 */

/**
*
* Reads alias form tsconfig.json's compilerOptions.paths
* @param {TsConfigOptions} [options]
*/
rewireAlias.fromTsConfig = (options = {}) => {
	const tsConfig = options.tsConfig || require(options.tsConfigPath || (path.resolve(process.cwd(), 'tsconfig.json')));

	const paths = tsConfig.compilerOptions.paths;

	const rootRegex = /^\.\//;
	const asteriscRegex = /\/\*$/;

	let alias = mapValues(paths, (value, key) => {
		if(!(value instanceof Array)) {
			throw new Error("tsconfig.json's paths entry must be an array");
		}

		value = value[0];

		value = value.replace(asteriscRegex, '');

		if(rootRegex.test(value)) {
			value = path.resolve(value);
		}

		return value;
	});

	alias = mapKeys(alias, (value, key) => key.replace(asteriscRegex, ''));

	return rewireAlias({
		alias
	});
}

module.exports = rewireAlias;