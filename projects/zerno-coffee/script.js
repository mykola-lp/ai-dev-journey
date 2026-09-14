const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach(
      (entry) =>
        entry.isIntersecting && entry.target.classList.add('is-visible'),
    ),
  { threshold: 0.12 },
);

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${(index % 3) * 100}ms`;
  observer.observe(element);
});
