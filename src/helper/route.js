const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const  promisify = require('util').promisify;
const  stat = promisify(fs.stat);
const  readdir = promisify(fs.readdir);
const tplPath = path.join(__dirname , '../template/dir.tpl');
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());
const mime = require('./mime');
const compress = require('./compress');
const range = require('./range');
const isFresh = require('./cache');

module.exports = async function (req , res , filePath , config) {
    try {
        const stats = await stat(filePath);
        if (stats.isFile()){
            //设置相应的文件格式
            const mimeType = mime(filePath);
            res.setHeader('Content-Type', mimeType);
            //判断是否走缓存
            if(isFresh(stats ,req ,res)){
                res.stautsCode = 304;
                res.end();
                return;
            }
            //是否range请求
            let rs;
            const{code,start,end} = range(stats.size , req ,res);
            if(code === 200){
                res.stautsCode = 200;
                rs = fs.createReadStream(filePath);
            }else{
                res.stautsCode = 206; 
                rs = fs.createReadStream(filePath,{start,end});
            }
            //压缩文件
            if(filePath.match(config.compress)){
                rs = compress(rs , req , res);
            }
            rs.pipe(res);
        }else if (stats.isDirectory()) {
            res.setHeader('Content-Type', 'text/html');
            const files = await readdir(filePath);
            const dir = path.relative(config.root , filePath);
            const data = {
                tiltle : path.basename(filePath),
                dir : dir ? `/${dir}` : '',
                files
            }
            res.end(template(data));
        }
    }catch (ex) {
        res.stautsCode = 404;
        res.end('404 not found!');
    }
}