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