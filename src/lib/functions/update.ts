import { writeFile } from 'fs/promises';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Create a function that updates package.json version.
export async function updatePackageVersion(version: string): Promise<void> {
	const pkgPath = join(process.cwd(), 'package.json');
	const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));
	pkg.version = version;
	await writeFile(pkgPath, JSON.stringify(pkg, null, 2));
}

updatePackageVersion(
	Bun.argv.find((arg) => arg.startsWith('--version='))?.split('=')[1] ??
		'1.0.0',
);
