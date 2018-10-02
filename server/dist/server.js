"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const logger = require("morgan");
const path = require("path");
const errorHandler = require("errorhandler");
const methodOverride = require("method-override");
const routes_1 = require("./routes/routes");
const dependencies_1 = require("./core/dependencies");
class Server {
    constructor() {
        this.logger = dependencies_1.Dependencies.get('logging').getLogger('Server');
        this.app = express();
        this.config();
        this.routes();
        this.api();
        this.logger.info('Server was constructed');
    }
    static bootstrap() {
        return new Server();
    }
    api() {
    }
    config() {
        this.app.use(express.static(path.join(__dirname, "public")));
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "pug");
        this.app.use(logger("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(cookieParser("SECRET_GOES_HERE"));
        this.app.use(methodOverride());
        this.app.use(function (err, req, res, next) {
            err.status = 404;
            next(err);
        });
        this.app.use(errorHandler());
    }
    routes() {
        let router;
        router = express.Router();
        this.router = new routes_1.Routes();
        this.router.create(router);
        this.app.use(router);
    }
}
exports.Server = Server;
