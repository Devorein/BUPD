#!/usr/bin/env zx

const packagesInfo = [['validation'], ['server', ['validation']]];

const $WORKSPACE = path.resolve(__dirname, '../');
console.log($WORKSPACE);

function scriptPathBuilder(packageName) {
	return `${$WORKSPACE}/node_modules/.bin/${packageName}`;
}

const tscPath = scriptPathBuilder('tsc');
const jestPath = scriptPathBuilder('jest');
const eslintPath = scriptPathBuilder('eslint');

async function executeScript(command, successMessage, errorMessage) {
	try {
		await command;
		console.log(chalk.green(successMessage));
	} catch (_) {
		console.log(chalk.red(errorMessage));
		await $`exit 1`;
	}
}

async function main() {
	for (let index = 0; index < packagesInfo.length; index++) {
		const [package, linkedPackages] = packagesInfo[index];
		const packageName = `@bupd/${package}`;
		cd(`${$WORKSPACE}/${package}`);

		console.log(`Building package ${chalk.blue.bold(packageName)}`);

		await executeScript(
			$`npm install -g`,
			`Successfully installed ${packageName} globally`,
			`Error installing ${packageName} globally`
		);

		await executeScript(
			$`npm install`,
			`Successfully installed ${packageName} dependencies`,
			`Error installing ${packageName} dependencies`
		);

		if (linkedPackages) {
			for (let index = 0; index < linkedPackages.length; index++) {
				const linkedPackage = linkedPackages[index];
				await executeScript(
					$`npm link @bupd/${linkedPackage}`,
					`Successfully linked @bupd/${linkedPackage} package`,
					`Error linking @bupd/${linkedPackage}`
				);
			}
		} else {
			console.log(chalk.green(`Linking not required for ${packageName}`));
		}

		await executeScript(
			$`node ${eslintPath} ./src --ext tsx,ts`,
			`Successfully linted ${packageName}`,
			`Error linting ${packageName}`
		);

		await executeScript(
			$`node ${tscPath} --sourceMap false`,
			`Successfully build ${packageName}`,
			`Error building ${packageName}`
		);

		if ((await $`[[ -d "./tests" ]]`.exitCode) == 0) {
			await executeScript(
				$`node ${jestPath} --runInBand`,
				`Successfully tested ${packageName}`,
				`Error testing ${packageName}`
			);
		} else {
			console.log(chalk.green(`Tests not found for ${packageName}`));
		}
	}
}

main();
