// The site's looping clips (D-236): each plays, muted and looping, only while it's on screen, so
// a clip loads only once scrolled to (the tags say preload="none") and stops using the
// processor when scrolled past. With reduced motion asked for, or with no scripts, they keep
// their poster and controls, so nothing moves unless the visitor plays it.
// A clip with a `data-poster` (the Features page's) gets its poster only as it nears the
// screen, so a page of many clips doesn't load every still up front.
(function () {
    var clips = document.querySelectorAll("video.clip");
    if (!clips.length) {
        return;
    }
    var waiting = document.querySelectorAll("video[data-poster]");
    var showPoster = function (clip) {
        clip.poster = clip.getAttribute("data-poster");
        clip.removeAttribute("data-poster");
    };
    if (!("IntersectionObserver" in window)) {
        waiting.forEach(showPoster);
        return;
    }
    var near = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                showPoster(entry.target);
                near.unobserve(entry.target);
            }
        });
    }, { rootMargin: "800px 0px" });
    waiting.forEach(function (clip) {
        near.observe(clip);
    });
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }
    var seen = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            var clip = entry.target;
            if (entry.isIntersecting) {
                var playing = clip.play();
                if (playing && playing.catch) {
                    // A browser that refuses to autoplay (a phone's power saving) gets the
                    // controls back, so the clip can still be played by hand.
                    playing.catch(function () {
                        clip.controls = true;
                    });
                }
            } else {
                clip.pause();
            }
        });
    }, { rootMargin: "200px 0px" });
    clips.forEach(function (clip) {
        clip.controls = false;
        seen.observe(clip);
    });
})();
