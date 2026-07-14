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
