/* Livora Dental Clinic — minimal, dependency-free script.
   No eval, no innerHTML, no network requests, no storage, no cookies. */
(function () {
  'use strict';

  var EMAIL = 'info@livoradentalclinic.com';
  document.documentElement.classList.add('js');

  /* ---------- Mobile navigation ---------- */
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var label = toggle.querySelector('.sr-only');
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.classList.toggle('is-open', open);
      if (label) { label.textContent = open ? 'Close menu' : 'Open menu'; }
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target && e.target.closest && e.target.closest('a')) { setOpen(false); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Appointment request form ---------- */
  var form = document.getElementById('book-form');
  if (!form) { return; }

  // Strip control characters and collapse whitespace (prevents header/line injection).
  function cleanLine(value) {
    return String(value || '')
      .replace(/[\u0000-\u001F\u007F\u0085\u2028\u2029]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function cleanBlock(value) {
    return String(value || '')
      .replace(/\r\n?/g, '\n')
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u0085\u2028\u2029]/g, '')
      .trim();
  }

  var fields = {
    name:    { el: document.getElementById('f-name'),   err: document.getElementById('e-name') },
    phone:   { el: document.getElementById('f-phone'),  err: document.getElementById('e-phone') },
    reason:  { el: document.getElementById('f-reason'), err: document.getElementById('e-reason') },
    when:    { el: document.getElementById('f-when'),   err: document.getElementById('e-when') },
    message: { el: document.getElementById('f-msg'),    err: document.getElementById('e-msg') }
  };
  var status = document.getElementById('form-status');

  var ALLOWED_REASONS = [];
  Array.prototype.forEach.call(fields.reason.el.options, function (o) {
    if (o.value) { ALLOWED_REASONS.push(o.value); }
  });

  function setError(key, message) {
    var f = fields[key];
    var wrap = f.el.closest('.field');
    if (message) {
      f.err.textContent = message;
      f.err.hidden = false;
      f.el.setAttribute('aria-invalid', 'true');
      if (wrap) { wrap.classList.add('has-error'); }
    } else {
      f.err.textContent = '';
      f.err.hidden = true;
      f.el.removeAttribute('aria-invalid');
      if (wrap) { wrap.classList.remove('has-error'); }
    }
  }

  function validate() {
    var data = {
      name: cleanLine(fields.name.el.value),
      phone: cleanLine(fields.phone.el.value),
      reason: cleanLine(fields.reason.el.value),
      when: cleanLine(fields.when.el.value),
      message: cleanBlock(fields.message.el.value)
    };
    var firstBad = null;
    function bad(key, msg) { setError(key, msg); if (!firstBad) { firstBad = fields[key].el; } }

    setError('name'); setError('phone'); setError('reason'); setError('when'); setError('message');

    if (data.name.length < 2 || data.name.length > 80) { bad('name', 'Enter your full name.'); }
    if (!/^\+?[0-9][0-9 ()\-]{6,19}$/.test(data.phone)) { bad('phone', 'Enter a phone number we can reach you on, for example 0978 172 528.'); }
    if (!data.reason || ALLOWED_REASONS.indexOf(data.reason) === -1) { bad('reason', 'Choose what you need.'); }
    if (data.when.length > 60) { bad('when', 'Keep this under 60 characters.'); }
    if (data.message.length > 600) { bad('message', 'Keep your message under 600 characters.'); }

    return { ok: !firstBad, data: data, focus: firstBad };
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var result = validate();
    if (!result.ok) {
      status.hidden = true;
      if (result.focus) { result.focus.focus(); }
      return;
    }
    var d = result.data;
    var subject = 'Appointment request: ' + d.reason;
    var body = [
      'Name: ' + d.name,
      'Phone: ' + d.phone,
      'Reason: ' + d.reason,
      'Preferred day or time: ' + (d.when || 'Not stated'),
      '',
      d.message || ''
    ].join('\r\n');

    var href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

    status.textContent = 'Your email app should open with your request ready to send. If nothing opens, email ' + EMAIL + ' or call 0978 172 528.';
    status.hidden = false;
    window.location.href = href;
  });

  // Clear a field's error as soon as the person edits it.
  Object.keys(fields).forEach(function (key) {
    var el = fields[key].el;
    el.addEventListener('input', function () { setError(key); });
    el.addEventListener('change', function () { setError(key); });
  });
})();
