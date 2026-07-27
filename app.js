// Общий скрипт для всех страниц: бургер-меню + отправка форм-заглушек.
(function () {
  var nav = document.querySelector('.mainnav');
  if (nav) {
    var burger = nav.querySelector('.burger');

    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    };

    burger.addEventListener('click', function () {
      setOpen(burger.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('.mainnav__link')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        burger.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target)) setOpen(false);
    });

    var wide = window.matchMedia('(min-width: 1101px)');
    var onWide = function (e) { if (e.matches) setOpen(false); };
    (wide.addEventListener ? wide.addEventListener.bind(wide, 'change') : wide.addListener.bind(wide))(onWide);
  }

  // Галерея товара: клик по миниатюре меняет главное изображение.
  var gallery = document.querySelector('.gallery');
  if (gallery) {
    var main = gallery.querySelector('.gallery__main img');
    gallery.querySelectorAll('.gallery__thumb').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var img = thumb.querySelector('img');
        if (!img || !main) return;
        var nextSrc = img.currentSrc || img.src;
        gallery.querySelectorAll('.gallery__thumb').forEach(function (t) { t.classList.remove('is-active'); });
        thumb.classList.add('is-active');
        main.src = nextSrc;
      });
    });
  }

  // Карусель фото (напр. «Доставка»): на мобильном листаем по 2 фото со стрелками.
  document.querySelectorAll('[data-photos]').forEach(function (carousel) {
    var track = carousel.querySelector('.photos');
    var items = carousel.querySelectorAll('.photos__item');
    var ctrl = carousel.querySelector('.photos-ctrl');
    var prev = carousel.querySelector('.photos-arrow--prev');
    var next = carousel.querySelector('.photos-arrow--next');
    var count = carousel.querySelector('.photos-count');
    var bar = carousel.querySelector('.photos-progress__bar');
    if (!track || !items.length) return;

    var per = parseInt(carousel.getAttribute('data-per'), 10) || 2;
    var gap = 16;
    var total = items.length;
    var pages = Math.ceil(total / per);
    var page = 0;
    var mq = window.matchMedia('(max-width: 760px)');

    var pad = function (n) { return (n < 10 ? '0' : '') + n; };

    var render = function () {
      if (!mq.matches) {
        carousel.classList.remove('is-carousel');
        if (ctrl) ctrl.hidden = true;
        track.style.transform = '';
        return;
      }
      carousel.classList.add('is-carousel');
      if (ctrl) ctrl.hidden = false;
      if (page > pages - 1) page = pages - 1;
      if (page < 0) page = 0;
      var pageW = carousel.clientWidth;
      track.style.transform = 'translateX(' + (-page * (pageW + gap)) + 'px)';
      var first = page * per + 1;
      var last = Math.min((page + 1) * per, total);
      if (count) count.innerHTML = pad(first) + '-' + pad(last) +
        '<span class="photos-count__total">/' + pad(total) + '</span>';
      if (bar) bar.style.width = ((page + 1) / pages * 100) + '%';
      if (prev) prev.disabled = page === 0;
      if (next) next.disabled = page === pages - 1;
    };

    if (prev) prev.addEventListener('click', function () { page--; render(); });
    if (next) next.addEventListener('click', function () { page++; render(); });

    var onChange = function () { render(); };
    (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(onChange);
    window.addEventListener('resize', render);
    render();
  });

  // Формы без бэкенда: показываем подтверждение вместо реальной отправки.
  document.querySelectorAll('form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var done = form.querySelector('.leadform__done, .js-form-done');
      if (done) { done.hidden = false; }
      form.reset();
    });
  });
})();
