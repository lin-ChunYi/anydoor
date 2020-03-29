const {cache} = require("../config/defaultConfig");

function refreshRes(stats , res){
    const {maxAge,expires,cacheControl,lastModified,eTag } = cache;

    if(expires){
        res.setHeader('Expires' , new Date(Date.now() + maxAge * 1000).toUTCString);
    }

    if(cacheControl){
        res.setHeader('cache-Control' , `public, max-age=${maxAge}`);
    }

    if(lastModified){
        res.setHeader('Last-Modified' , stats.mtime.toUTCString);
    }

    if(eTag){
        res.setHeader('ETag' , `${stats.size}-${stats.mtime}`);
    }
}

module.exports = function refresh(stats , req , res){
    const lastModified = req.headers['if-modified-since'];
    const etag = req.headers['if-none-match'];

    if(!lastModified && !etag){
        return false;
    }

    if(lastModified && lastModified !== res.headers['Last-Modified']){
        return false;
    }
    
    if(etag && etag !== res.headers['ETag']){
        return false;
    }

    return true;
}