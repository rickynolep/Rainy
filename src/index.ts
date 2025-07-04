(async () => {
    try {
        await import('./function/bootstrap.js');
        await import('./function/config.js');
        await import('./main.js');
    } catch (e) {
        console.error(e);
        process.exit(1);
    }

})();