import { GameManager } from './game_manager';
import { StorageManager } from './storage_manager';
import { CanvasActuator } from './canvas_actuator';
import { InputManager } from './input_manager';

const clearSansData = Switch.readFileSync(
	new URL('fonts/ClearSans-Regular.ttf', Switch.entrypoint)
);
const clearSansBoldData = Switch.readFileSync(
	new URL('fonts/ClearSans-Bold.ttf', Switch.entrypoint)
);
fonts.add(new FontFace('Clear Sans', clearSansData));
fonts.add(new FontFace('Clear Sans', clearSansBoldData, { weight: 'bold' }));

new GameManager(4, InputManager, CanvasActuator, StorageManager);
