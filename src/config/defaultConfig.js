module.exports = {
    root : process.cwd(),
    host : 'localhost',
    port : '9527',
    compress : /\.(html|js|css|md)/,
    cache : {
        maxAge : 600,
        expires : true,
        cacheControl : true,
        lastModified : true,
        eTag : true
    }
}