// YouTube IFrame API helper to automatically request HD1080 playback
(function () {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
        document.head.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = function () {
        var iframe = document.getElementById('RightVideo');
        if (iframe && window.YT && window.YT.Player) {
            new window.YT.Player('RightVideo', {
                events: {
                    'onReady': function (event) {
                        try {
                            event.target.setPlaybackQuality('hd1080');
                            event.target.setSuggestedQuality('hd1080');
                        } catch (e) {}
                    },
                    'onStateChange': function (event) {
                        try {
                            if (event.data === window.YT.PlayerState.PLAYING || event.data === window.YT.PlayerState.BUFFERING) {
                                event.target.setPlaybackQuality('hd1080');
                                event.target.setSuggestedQuality('hd1080');
                            }
                        } catch (e) {}
                    }
                }
            });
        }
    };
})();
