(function () {
  var nav = document.querySelector(".site-nav");
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a[href^='/#'], .nav-links a[href^='#']"));
  var sections = links
    .map(function (link) {
      var id = link.getAttribute("href").split("#")[1];
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  function onScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 20);
    var current = sections[0];
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top < window.innerHeight * 0.38) current = section;
    });
    links.forEach(function (link) {
      link.classList.toggle("is-active", current && link.getAttribute("href").indexOf("#" + current.id) > -1);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // dev helper: ?scrollvh=1.7 jumps to that scroll depth (for headless screenshots)
  var scrollMatch = window.location.search.match(/[?&]scrollvh=([0-9.]+)/);
  if (scrollMatch) {
    setTimeout(function () {
      window.scrollTo({ top: window.innerHeight * parseFloat(scrollMatch[1]), behavior: "auto" });
      window.dispatchEvent(new Event("scroll"));
    }, 400);
  }

  if (window.gsap) {
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    gsap.from(".hero .reveal", { y: 18, duration: 0.85, stagger: 0.08, ease: "power3.out", clearProps: "transform" });
    gsap.utils.toArray(".section .reveal, .subpage-main .reveal, .subpage-hero .reveal").forEach(function (item) {
      gsap.from(item, {
        y: 18,
        duration: 0.7,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: { trigger: item, start: "top 86%" }
      });
    });
    gsap.utils.toArray(".project-card").forEach(function (card) {
      card.addEventListener("pointerenter", function () {
        gsap.to(card, { y: -6, duration: 0.22, ease: "power2.out" });
      });
      card.addEventListener("pointerleave", function () {
        gsap.to(card, { y: 0, duration: 0.22, ease: "power2.out" });
      });
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (item) {
      item.style.opacity = 1;
      item.style.transform = "none";
    });
  }
})();


