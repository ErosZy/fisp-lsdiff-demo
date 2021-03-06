fis.config.merge({
	namespace : 'common',
    modules : {
        postpackager : "lsdiff-map"
    },
    pack : {
        'static/pkg/aio.css' : 'widget/**.css',
        'static/pkg/aio.js' : 'widget/nav/**.js'
    }
});

fis.config.get("roadmap.path").unshift({
    reg : /\/lsdiff\-plugin\/(plugin\/.*\.php)$/i,
    release : '/$1'
});

fis.config.get("roadmap.path").unshift({
    reg : "lsdiff-backend/**",
    release : false
});

fis.config.get("roadmap.path").unshift({
    reg : /lsdiff\-backend\/ls\-diff\.php/i,
    release : '/config/ls-diff.php'
});