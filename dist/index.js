import { reloadConfig } from './function/config.js';
import { main } from './main.js';
(async () => {
    try {
        await import('./bootstrap.js');
        await reloadConfig();
        await main();
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
