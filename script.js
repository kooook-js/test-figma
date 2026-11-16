// Reveal-on-scroll
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  els.forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 80 + 'ms';
    io.observe(el);
  });
})();

// Contact form validation
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var rules = {
    name: function (v) { return v.trim().length >= 2; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
    topic: function (v) { return v !== ''; },
    message: function (v) { return v.trim().length >= 10; }
  };

  function check(name) {
    var input = form.elements[name];
    var ok = rules[name](input.value);
    var field = input.closest('.field');
    field.classList.toggle('invalid', !ok);
    field.classList.toggle('valid', ok);
    return ok;
  }

  Object.keys(rules).forEach(function (name) {
    var input = form.elements[name];
    input.addEventListener('blur', function () { check(name); });
    input.addEventListener('input', function () {
      // re-validate live only after the field has been flagged once
      if (input.closest('.field').classList.contains('invalid')) check(name);
    });
    input.addEventListener('change', function () { check(name); });
  });

  var count = document.getElementById('count');
  form.elements.message.addEventListener('input', function (e) {
    count.textContent = e.target.value.length;
  });

  var success = document.getElementById('success');
  var btn = document.getElementById('submit');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var results = Object.keys(rules).map(check);
    if (results.indexOf(false) !== -1) {
      var firstBad = form.querySelector('.field.invalid input, .field.invalid select, .field.invalid textarea');
      if (firstBad) firstBad.focus();
      return;
    }
    btn.disabled = true;
    btn.textContent = 'กำลังส่ง…';
    setTimeout(function () {
      document.getElementById('success-text').textContent =
        'ขอบคุณคุณ ' + form.elements.name.value.trim() + ' เราจะตอบกลับที่ ' + form.elements.email.value.trim();
      form.classList.add('hidden');
      success.classList.add('show');
    }, 700);
  });

  document.getElementById('again').addEventListener('click', function () {
    form.reset();
    count.textContent = '0';
    form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('valid', 'invalid'); });
    btn.disabled = false;
    btn.textContent = 'ส่งข้อความ';
    success.classList.remove('show');
    form.classList.remove('hidden');
  });
})();
