import('./function/bootstrap.js')
    .then(() => import('./function/config.js'))
    .then(() => import('./main.js'))
    .catch((e) => {
        console.error(e);
        process.exit(1);
});