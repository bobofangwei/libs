import loadImages from './loadImages';
var imgs = ['https://gss0.bdstatic.com/5bVWsj_p_tVS5dKfpU_Y_D3/res/r/image/2017-05-16/bfe803a94c949fe78ba634b51bf2395c.jpg'];
loadImages(imgs, function() {
    console.log('加载完毕');
});
