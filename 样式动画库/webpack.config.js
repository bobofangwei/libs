var path=require('path');
var HtmlWebpackPlugin=require('html-webpack-plugin');
module.exports={
    context:__dirname,
    entry:'./src/test.js',
    output:{
        filename:'js/[name].js',
        path:path.join(__dirname,'build')
    },
    plugins:[
            new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject:'body'
        })
    ]
};