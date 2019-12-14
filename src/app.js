import express from 'express';
import path from 'path';
import router from './routes';
import './database';

class App {
    constructor() {
        this.server = express();
        this.middleware();
        this.router();
    }

    middleware() {
        this.server.use(express.json());
        this.server.use(
            'files',
            express.static(path.resolve(__dirname, '..', 'temp', 'upload'))
        );
    }

    router() {
        this.server.use(router);
    }
}

export default new App().server;
