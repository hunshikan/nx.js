import { erase } from 'sisteransi';
import { bold, cyan, bgYellow } from 'kleur/colors';

console.log('Welcome to the nx.js REPL!');
console.log('Use a keyboard to enter JavaScript code.');
console.log('Press the + button or the "Esc" key to exit...');
console.log();

let buffer = '';
let historyIndex = 0;
let cursorPosition = 0;
const history: string[] = [];
const prompt = bold(cyan('> '));

const cursorChar = (v: string) => bold(bgYellow(v || ' '));

function renderPrompt() {
	let b = buffer;
	if (cursorPosition >= 0) {
		const bufferL = buffer.slice(0, cursorPosition);
		const bufferP = buffer[cursorPosition];
		const bufferR = buffer.slice(cursorPosition + 1);
		b = `${bufferL}${cursorChar(bufferP)}${bufferR}`;
	}
	Switch.print(`\r${erase.line}${prompt}${b}`);
}

Switch.addEventListener('keydown', (e) => {
	const { key } = e;
	if (key.length === 1) {
		// Printable character
		buffer = `${buffer.slice(0, cursorPosition)}${key}${buffer.slice(
			cursorPosition
		)}`;
		cursorPosition++;
		renderPrompt();
	} else if (key === 'Enter') {
		// Remove cursor
		cursorPosition = -1;
		renderPrompt();
		Switch.print('\n');
		try {
			history.push(buffer);
			historyIndex = history.length;
			const trimmed = buffer.trim();
			const result =
				trimmed.length === 0 ? undefined : eval(`(${trimmed})`);
			buffer = '';
			cursorPosition = 0;
			Switch.print(`${Switch.inspect(result)}\n\n`);
		} catch (err: unknown) {
			buffer = '';
			cursorPosition = 0;
			if (err instanceof Error) {
				console.log(`${err}\n${err.stack}`);
			} else {
				console.log(`Error: ${err}`);
			}
		}
		renderPrompt();
	} else if (key === 'Backspace') {
		if (buffer.length) {
			buffer = `${buffer.slice(0, cursorPosition - 1)}${buffer.slice(
				cursorPosition
			)}`;
			cursorPosition--;
			renderPrompt();
		}
	} else if (key === 'ArrowUp') {
		if (historyIndex > 0) {
			buffer = history[--historyIndex];
			cursorPosition = buffer.length;
			renderPrompt();
		}
	} else if (key === 'ArrowDown') {
		if (historyIndex < history.length) {
			buffer = history[++historyIndex] ?? '';
			cursorPosition = buffer.length;
			renderPrompt();
		}
	} else if (key === 'ArrowLeft') {
		if (cursorPosition > 0) {
			cursorPosition--;
			renderPrompt();
		}
	} else if (key === 'ArrowRight') {
		if (cursorPosition < buffer.length) {
			cursorPosition++;
			renderPrompt();
		}
	} else if (key === 'Escape') {
		Switch.exit();
	}
});

renderPrompt();
