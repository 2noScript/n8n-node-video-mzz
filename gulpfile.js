
const { task, src, dest } = require('gulp');

task('build:icons', copyIcons);

function copyIcons() {
	const nodeSource = 'nodes/**/*.{png,svg}';
	const nodeDestination = 'dist/nodes';

	const credSource = 'credentials/**/*.{png,svg}';
	const credDestination = 'dist/credentials';

	const stream1 = src(nodeSource,{encoding: false}).pipe(dest(nodeDestination));
	const stream2 = src(credSource,{encoding: false}).pipe(dest(credDestination));

	return Promise.all([
		new Promise((resolve) => stream1.on('end', resolve)),
		new Promise((resolve) => stream2.on('end', resolve)),
	]);
}
	