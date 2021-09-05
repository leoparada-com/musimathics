$(document).ready(function() {

    var notes = [
        ['C4', 'F#4'],
        ['C#4', 'G4'],
        ['D4', 'G#4'],
        ['D#4', 'A4'],
        ['E4', 'A#4'],
        ['F4', 'B4'],
        ['F#4', 'C5'],
        ['G4', 'C#5'],
        ['G#4', 'D5'],
        ['A4', 'D#5'],
        ['A#4', 'E5'],
        ['G4', 'F5'],
    ];
    var commonWidth = 200;
    var toneWidth = 0.4;
    var menu = $('#menu-body');
    var timeline = $('#timeline-body');
    var selectedIdMenu;
    var selectedLineItem;
    var closedIdMenu;
    var draggingFromMenu = false;
    var draggingFromLine = false;
    var timelineQueue = [];
    var widthQueue = [];
    var timelineWidth = 0;
    initMenu();
    var mousepos = { 'x': 0, 'y': 0 };
    var resizing = false;
    var curitem;
    var width = 0;

    function setTimelineItemFuns() {
        $('.timeline-item .handle').mousedown(function(e) {
            resizing = true;
            curitem = $(e.target).parent()[0];
            mousepos.x = e.pageX;
            mousepos.y = e.pageY;
            width = getWidth(curitem);
            e.preventDefault();
        });
        $('.timeline-body').mouseup(function() {
            resizing = false;
            curitem = null;
        });
        $('.timeline-body').parent().mousemove(function(e) {

            if (resizing) {
                var curmousepos = { 'x': e.pageX, 'y': e.pageY };
                addWidth(curitem, getDis(mousepos, curmousepos));
            }
        });
        $('.timeline-item').on('mousedown', function(e) {})
    }

    function addWidth(e, amt) {

        var w = width + amt;
        if (w < commonWidth) {
            w = commonWidth;
        }
        if (w > commonWidth * 2) {
            w = commonWidth * 2;
        }
        e.style.width = w + 'px'
        var index = timelineQueue.indexOf(parseInt(e.id));
        widthQueue[index] = w;
    }

    function getWidth(e) {
        var st = window.getComputedStyle(e, null);
        return parseInt(st.getPropertyValue('width'));
    }

    function getDis(pos1, pos2) {
        return pos2.x - pos1.x;
    }

    function dragstartFromMenu(ev) {
        selectedIdMenu = ev.target.id;
        draggingFromMenu = true;
    }

    function dragenterOnTimeline(ev) {
        ev.preventDefault();
    }

    function dragleaveOnTimeline(ev) {
        ev.preventDefault();
    }

    function dragoverOnTimeline(ev) {
        ev.preventDefault();
    }

    function dragstartFromLine(ev) {
        selectedLineItem = parseInt(ev.target.id);
        draggingFromLine = true;
    }

    function dragenterOnTimelineItem(ev) {
        ev.preventDefault();
    }

    function dragleaveOnTimelineItem(ev) {
        ev.preventDefault();
    }

    function dragoverOnTimelineItem(ev) {
        ev.preventDefault();
    }

    function dropOnTimelineItem(ev) {
        ev.preventDefault();

        if (draggingFromLine) {
            var draggingLineIndex = timelineQueue.indexOf(selectedLineItem);
            var targetLineIndex = timelineQueue.indexOf(parseInt(ev.target.id));

            var tmp = timelineQueue[draggingLineIndex];
            timelineQueue[draggingLineIndex] = timelineQueue[targetLineIndex];
            timelineQueue[targetLineIndex] = tmp;

            tmp = widthQueue[draggingLineIndex];
            widthQueue[draggingLineIndex] = widthQueue[targetLineIndex];
            widthQueue[targetLineIndex] = tmp;

            var dragging = $('#' + selectedLineItem)[0];
            var nextOfdragging = dragging.nextSibling;
            var target = ev.target;
            var nextOftarget = target.nextSibling;

            var parent = ev.target.parentNode;
            parent.insertBefore(dragging, nextOftarget);
            parent.insertBefore(target, nextOfdragging);
            draggingFromLine = false;
        }
    }

    function dropOnTimeline(ev) {
        ev.preventDefault();
        if (draggingFromMenu) {

            $('#' + selectedIdMenu).addClass('none');
            var no = selectedIdMenu.substring(10);
            timeline.append('<div class="timeline-item" draggable="true" id="' + no + '" style="background-image:' + "url('./public/images/time_line/" + no + ".png');" + '"><span class="close-btn">&times;</span><div class="handle"></div></div>');
            $('.timeline-item .close-btn').on('click', closeTimelineItem);
            $('.timeline-item')
                .on('dragstart', dragstartFromLine)
                .on('dragenter', dragenterOnTimelineItem)
                .on('dragleave', dragleaveOnTimelineItem)
                .on('drop', dropOnTimelineItem)

            timelineQueue.push(parseInt(no));
            var width = getWidth($('#' + no)[0]);
            widthQueue.push(width);

            timelineWidth = widthQueue.reduce(function(a, b) {
                return a + b;
            }, 0);
            if (timelineWidth * 2 < screen.width) {
                timeline[0].style.width = screen.width + 'px';
            } else {
                timeline[0].style.width = timelineWidth * 2 + 'px';
            }

            setTimelineItemFuns();
        }
        console.log(timelineQueue);
        draggingFromMenu = false;
    }

    function closeTimelineItem(ev) {
        var id = parseInt(ev.target.parentNode.id);
        $('#menu-item-' + id).removeClass('none');
        $('#' + id).remove();
        console.log(id);
        var index = timelineQueue.indexOf(id);
        var tmpArr1 = [];
        var tmpArr2 = [];
        for (let i = 0; i < timelineQueue.length; i++) {
            if (i == index) continue;
            tmpArr1.push(timelineQueue[i]);
            tmpArr2.push(widthQueue[i]);
        }
        timelineQueue = tmpArr1;
        widthQueue = tmpArr2;
        console.log(timelineQueue, widthQueue);
    }

    function initMenu() {
        for (let i = 1; i <= 12; i++) {
            menu.append('<img class="item" draggable="true" id="menu-item-' + i + '" src="./public/images/' + i + '.png">');
        }
        $('#menu-body .item').on('dragstart', dragstartFromMenu);
        timeline[0].style.width = screen.width + 'px';
        timeline
            .on('dragover', dragoverOnTimeline)
            .on('drop', dropOnTimeline)
            .on('dragenter', dragenterOnTimeline)
            .on('dragleave', dragleaveOnTimeline);
    }

    var playing = false;

    var controlBtn = $("#control-button");
    controlBtn.click(function() {
        if (timelineQueue.length == 0) {
            alert('Invalid Timeline');
            return;
        }
        if (playing) {
            return;
        }
        controlBtn.addClass('paused');
        playing = true;
        const synth = new Tone.Synth().toDestination();
        const now = Tone.now();
        var cnt = 0;
        console.log(cnt);
        var prevTime = 0;
        timelineQueue.forEach(e => {
            synth.triggerAttackRelease(notes[e][0], widthQueue[cnt] / 500, now + prevTime);
            synth.triggerAttackRelease(notes[e][1], widthQueue[cnt] / 1000, now + widthQueue[cnt] / 1000 + prevTime);
            prevTime += widthQueue[cnt] / 500;
            cnt++;
        });
        setTimeout(function() {
            controlBtn.removeClass('paused');
            playing = false;
        }, prevTime * 1000);
        // controlBtn.toggleClass("paused");
        return false;
    });
});