import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const test = suite('Switch');

test('Switch namespace', () => {
	const desc = Object.getOwnPropertyDescriptor(globalThis, 'Switch')!;
	assert.equal(desc.writable, true);
	assert.equal(desc.enumerable, false);
	assert.equal(desc.configurable, true);
	assert.equal(Object.prototype.toString.call(Switch), '[object Switch]');
});

test('`Switch.entrypoint` is a string', () => {
	assert.type(Switch.entrypoint, 'string');
	assert.ok(Switch.entrypoint.length > 0);
});

test('`Switch.cwd()` is a URL string representation', async () => {
	const cwd = Switch.cwd();
	assert.type(cwd, 'string');
	assert.ok(cwd.startsWith('sdmc:/'));
	assert.ok(cwd.endsWith('/'));
});

test('`Switch.readDirSync()` works on relative path', () => {
	const files = Switch.readDirSync('.');
	assert.ok(Array.isArray(files));
	assert.ok(files.length > 0);
});

test('`Switch.readDirSync()` works on `sdmc:/` path', () => {
	const files = Switch.readDirSync('sdmc:/');
	assert.ok(Array.isArray(files));
	assert.ok(files.length > 0);
});

test('`Switch.readDirSync()` works on `romfs:/` path', () => {
	const files = Switch.readDirSync('romfs:/');
	assert.ok(Array.isArray(files));
	assert.ok(files.length > 0);
});

test('`Switch.readFileSync()` returns `null` when file does not exist', () => {
	assert.equal(Switch.readFileSync('romfs:/__does_not_exist__'), null);
});

test('`Switch.readDirSync()` returns `null` when directory does not exist', () => {
	assert.equal(Switch.readDirSync('romfs:/__does_not_exist__'), null);
});

test('`Switch.statSync()` returns `null` when file does not exist', () => {
	assert.equal(Switch.statSync('romfs:/__does_not_exist__'), null);
});

test('`Switch.resolveDns()` works', async () => {
	const result = await Switch.resolveDns('n8.io');
	assert.ok(Array.isArray(result));
	assert.ok(result.length > 0);
});

test('`Switch.resolveDns()` rejects with invalid hostname', async () => {
	let err: Error | undefined;
	try {
		await Switch.resolveDns('example-that-definitely-does-not-exist.nxjs');
	} catch (_err) {
		err = _err as Error;
	}
	assert.ok(err);
});

test('`Switch.readFile()` works with string path', async () => {
	const data = await Switch.readFile('romfs:/runtime.js');
	assert.ok(data instanceof ArrayBuffer);
	assert.ok(data.byteLength > 0);
});

test('`Switch.readFile()` works with URL path', async () => {
	const data = await Switch.readFile(new URL(Switch.entrypoint));
	assert.ok(data instanceof ArrayBuffer);
	assert.ok(data.byteLength > 0);
});

test('`Switch.readFile()` rejects when file does not exist', async () => {
	let err: Error | undefined;
	try {
		await Switch.readFile('romfs:/__does_not_exist__');
	} catch (_err) {
		err = _err as Error;
	}
	assert.ok(err);
});

test('`Switch.readFile()` rejects when attempting to read a directory', async () => {
	let err: Error | undefined;
	try {
		await Switch.readFile('.');
	} catch (_err) {
		err = _err as Error;
	}
	assert.ok(err);
});

test('`Switch.stat()` returns file information', async () => {
	const stat = await Switch.stat(Switch.entrypoint);
	assert.ok(stat);
	assert.ok(stat.size > 0);
});

test('`Switch.stat()` rejects when file does not exist', async () => {
	let err: Error | undefined;
	try {
		await Switch.stat('romfs:/__does_not_exist__');
	} catch (_err) {
		err = _err as Error;
	}
	assert.ok(err);
});

test("`Switch.removeSync()` doesn't throw when path does not exist", async () => {
	const path = 'sdmc:/__does_not_exist';
	Switch.removeSync(path);
	assert.ok(true);
});

test('`Switch.removeSync()` removes file', async () => {
	const path = 'sdmc:/__nxjs-test.txt';
	const uuid = crypto.randomUUID();
	Switch.writeFileSync(path, uuid);
	const data = Switch.readFileSync(path);
	assert.ok(data);
	assert.equal(new TextDecoder().decode(data), uuid);

	Switch.removeSync(path);
	assert.equal(Switch.statSync(path), null);
});

test('`Switch.removeSync()` removes directory', async () => {
	const path = 'sdmc:/__nxjs-test';
	Switch.mkdirSync(path);
	assert.ok(Switch.statSync(path));

	Switch.removeSync(path);
	assert.equal(Switch.statSync(path), null);
});

test('`Switch.removeSync()` removes nested directory', async () => {
	const dir = 'sdmc:/__nested';
	const path = `${dir}/another/nxjs-test/file.txt`;
	Switch.writeFileSync(path, 'hello world');
	assert.ok(Switch.statSync(dir));
	assert.ok(Switch.statSync(path));

	Switch.removeSync(dir);
	assert.equal(Switch.statSync(dir), null);
	assert.equal(Switch.statSync(path), null);
});

test.run();
