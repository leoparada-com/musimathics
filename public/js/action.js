$(document).ready(function() {

    var cur_block;
    var resizing = false;
    var mousepos = { 'x': null, 'y': null };
    var width = 0;
    $('.resizable').append("<div class='handle r'>");
    $('.resizable').append("<div class='handle l'>");

    $('.resizable .handle.r').mousedown(function(e) {
        resizing = true;
        cur_block = $(e.target).parent()[0];
        mousepos.x = e.pageX;
        mousepos.y = e.pageY;
        width = getWidth(cur_block);
    });
    $('.resizable .handle.r').mouseup(function() {
        resizing = false;
        cur_block = null;
        console.log(resizing);
    });
    $(document).mouseup(function() {
        resizing = false;
        cur_block = null;
    });
    $('.resizable').parent().mousemove(function(e) {

        if (resizing) {
            var curmousepos = { 'x': e.pageX, 'y': e.pageY };
            addWidth(cur_block, getDis(mousepos, curmousepos, getRotate(cur_block)));
        }
    });

    function getWidth(e) {
        var st = window.getComputedStyle(e, null);
        return parseInt(st.getPropertyValue('width'));

    }

    function addWidth(e, amt) {
        // var st = window.getComputedStyle(e, null);
        // var width = parseInt(st.getPropertyValue('width')) + amt;
        var w = width + amt * 2;
        console.log(w);
        e.style.width = w + 'px'
    }

    function getRotate(e) {
        var st = window.getComputedStyle(e, null);
        var tr = st.getPropertyValue("-webkit-transform") ||
            st.getPropertyValue("-moz-transform") ||
            st.getPropertyValue("-ms-transform") ||
            st.getPropertyValue("-o-transform") ||
            st.getPropertyValue("transform") ||
            "fail...";

        var values = tr.split('(')[1];
        values = values.split(')')[0];
        values = values.split(',');
        var a = values[0];
        var b = values[1];
        var c = values[2];
        var d = values[3];

        var scale = Math.sqrt(a * a + b * b);
        var cos = a / scale;
        // var angle = Math.round(Math.asin(sin) * (180 / Math.PI));
        var angle = Math.acos(cos);
        return angle;
    }

    function getDis(pos1, pos2, angle) {

        var dis = Math.sqrt((pos1.x - pos2.x) * (pos1.x - pos2.x) + (pos2.y - pos1.y) * (pos2.y - pos1.y));
        // return dis;
        var a = Math.acos((pos2.x - pos1.x) / dis);
        return Math.round(dis * Math.cos(a + angle));
        // return pos1.x - pos2.x;
    }
});