const http = require('http');
const chalk = require('chalk');
const path = require('path');
const route = require('./helper/route');
const conf = require('./config/defaultConfig');
const openUrl = require('./helper/openUrl');

class Server{
    constructor(config){
        this.conf = Object.assign({}, conf, config);
    }

    start(){
        const server = http.createServer((req, res) => {
            const filePath = path.join(this.conf.root , req.url);
            route(req,res,filePath,this.conf);
        });
        
        server.listen(this.conf.port, this.conf.host, () => {
            var addr = `http://${this.conf.host}:${this.conf.port}`;
            console.info(`Server address is : ${chalk.green(addr)}`);
            openUrl(addr);
        })
    }
}

module.exports = Server;
