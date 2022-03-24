import http from 'http';
import app from './server';
import log from 'utils/logger';
/**
 * Start Express server
 */
const server = http.createServer(app);
server.listen(app.get('port'), () => {
    log.info('Server is running at port %s', app.get('port'));
});

module.exports = server;
