// The landing page's beat clips (D-236): each plays, muted and looping, only while it's on
// screen, so a clip loads only once scrolled to (the tags say preload="none") and stops using
// the processor when scrolled past. With reduced motion asked for, or with no scripts, they keep
// their poster and controls, so nothing moves unless the visitor plays it.
(function () {
    var clips = document.querySelectorAll("video.clip");
    if (!clips.length || !("IntersectionObserver" in window)) {
        return;
    }
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
