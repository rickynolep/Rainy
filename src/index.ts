import { main } from './main.js';

(async () => {
    try {
        await import('./function/bootstrap.js');
        await import('./function/config.js');
        await main();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }

})();