/* Small, dependency-free interactions. Actual audio drives the waveform. */
(() => {
  const config = window.PORTFOLIO || {};
  const $ = (s) => document.querySelector(s);
  function safeUrl(value) {
    if (!value || typeof value !== 'string') return '';
    try {
      const url = new URL(value, location.href);
      return ['http:', 'https:', 'file:'].includes(url.protocol) ? value : '';
    } catch { return ''; }
  }
  function renderMedia(slot, item) {
    if (!slot) return;
    slot.replaceChildren();
    const url = safeUrl(item.mediaUrl);
    if (!url) return;
    if (item.mediaType === 'link') {
      const link = document.createElement('a');
      link.href = url; link.className = 'external-play';
      link.textContent = 'Hear the call ↗'; link.target = '_blank'; link.rel = 'noopener noreferrer';
      slot.append(link); return;
    }
    const media = document.createElement(item.mediaType === 'video' ? 'video' : 'audio');
    media.src = url; media.controls = true; media.preload = 'none';
    media.setAttribute('aria-label', item.title || 'Broadcast recording');
    if (media.tagName === 'VIDEO') {
      media.playsInline = true;
      if (safeUrl(item.poster)) media.poster = item.poster;
    }
    const message = document.createElement('p');
    message.className = 'playback-status'; message.setAttribute('role', 'status');
    media.addEventListener('error', () => {message.textContent = 'This recording could not load. Please check the media link.';});
    const canvas = document.createElement('canvas');
    canvas.className = 'waveform'; canvas.width = 600; canvas.height = 70; canvas.hidden = true;
    canvas.setAttribute('aria-hidden', 'true');
    let context, analyser, samples, frame;
    media.addEventListener('play', () => {
      document.querySelectorAll('audio,video').forEach(other => {if(other !== media) other.pause();});
      // Remote hosting may restrict analysis; normal playback still works.
      if (new URL(url, location.href).origin !== location.origin) return;
      try {
        if (!context) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (!AudioContext) return;
          context = new AudioContext(); analyser = context.createAnalyser(); analyser.fftSize = 128;
          const source = context.createMediaElementSource(media);
          source.connect(analyser); analyser.connect(context.destination);
          samples = new Uint8Array(analyser.frequencyBinCount);
        }
        context.resume();
        function draw() {
          if (media.paused || !media.isConnected) {canvas.hidden = true; return;}
          const reduced = document.body.classList.contains('reduced-motion') || matchMedia('(prefers-reduced-motion: reduce)').matches;
          canvas.hidden = reduced;
          if (!reduced) {
            analyser.getByteFrequencyData(samples);
            const paint = canvas.getContext('2d'); paint.clearRect(0, 0, canvas.width, canvas.height);
            paint.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent');
            samples.forEach((level, i) => {const height = level / 255 * 65; paint.fillRect(i*9.4, (70-height)/2, 5, height);});
          }
          frame = requestAnimationFrame(draw);
        }
        cancelAnimationFrame(frame); draw();
      } catch { canvas.hidden = true; }
    });
    media.addEventListener('pause', () => {cancelAnimationFrame(frame); canvas.hidden = true;});
    slot.append(media, canvas, message);
  }
  const motion = $('.motion-toggle');
  let reduced = false;
  try { reduced = localStorage.getItem('jase-reduce-motion') === 'true'; } catch {}
  function updateMotion() {
    document.body.classList.toggle('reduced-motion', reduced);
    if(motion) {motion.setAttribute('aria-pressed', String(reduced)); motion.textContent = reduced ? 'Motion reduced' : 'Reduce motion';}
  }
  updateMotion();
  motion?.addEventListener('click', () => {reduced = !reduced; updateMotion(); try{localStorage.setItem('jase-reduce-motion', String(reduced));}catch{}});
  if(document.body.classList.contains('home')) {
    let selected = null, venue = 'us131';
    const gateway = $('#sport-gateway'), stage = $('#selected-scene');
    const scenes = {us131:{label:'U.S. 131 Motorsports Park', image:'assets/us131.jpg'},bristol:{label:'Bristol Dragway',image:'assets/bristol.jpg'}};
    function changeSport(sport, moveFocus = false) {
      gateway.hidden = true; stage.hidden = false;
      document.querySelectorAll('audio,video').forEach(media => media.pause());
      selected = sport; const racing = sport === 'racing', item = config[sport] || {};
      document.body.dataset.sport = sport;
      document.body.classList.remove('scene-enter');
      void document.body.offsetWidth; document.body.classList.add('scene-enter');
      document.querySelectorAll('[data-select]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.select === sport)));
      $('.edition').textContent = racing ? '01 / RACING' : '02 / BASKETBALL';
      $('#scene-label').textContent = racing ? scenes[venue].label : 'Basketball · Play-by-play';
      $('#call-title').textContent = racing ? 'At the track.' : 'On the court.';
      $('#availability').textContent = item.mediaUrl ? item.title : (racing ? 'Racing call coming soon.' : 'Basketball call coming soon.');
      $('.pill').textContent = item.mediaUrl ? 'SELECTED RECORDING' : 'RECORDING PENDING';
      $('#detail-link').href = sport + '.html';
      $('#detail-link').replaceChildren(document.createTextNode('Explore ' + sport + ' '));
      const arrow = document.createElement('span'); arrow.textContent = '↗'; $('#detail-link').append(arrow);
      $('#venue-controls').hidden = !racing;
      $('#photo-caption').textContent = racing ? scenes[venue].label + ' · View from the track' : 'Basketball · Venue photo coming soon';
      const environment = $('.environment');
      environment.style.backgroundImage = racing ? `linear-gradient(90deg,#05100bd9,#07120c30),linear-gradient(0deg,#07120cef,transparent 70%),url('${scenes[venue].image}')` : '';
      renderMedia($('#home-media'), item);
      const stateUrl = new URL(location.href); stateUrl.searchParams.set('sport', sport);
      history.replaceState(null, '', stateUrl);
      if(moveFocus) $('#scene-title').focus({preventScroll:true});
    }
    document.querySelectorAll('[data-select]').forEach(button => button.addEventListener('click', () => changeSport(button.dataset.select, true)));
    document.querySelectorAll('[data-venue]').forEach(button => button.addEventListener('click', () => {
      venue = button.dataset.venue;
      document.querySelectorAll('[data-venue]').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.venue === venue)));
      changeSport(selected);
    }));
    document.querySelectorAll('[data-choice]').forEach(link => link.addEventListener('click', event => {
      if(event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); changeSport(link.dataset.choice, true);
    }));
    $('#back-to-choices').addEventListener('click', () => {
      document.querySelectorAll('audio,video').forEach(media => media.pause());
      $('#home-media').replaceChildren();
      const previous = selected;
      selected = null; stage.hidden = true; gateway.hidden = false;
      document.body.dataset.sport = 'choice'; document.body.classList.remove('scene-enter');
      document.querySelectorAll('[data-select]').forEach(button => button.setAttribute('aria-pressed','false'));
      const stateUrl = new URL(location.href); stateUrl.searchParams.delete('sport');
      history.replaceState(null, '', stateUrl);
      document.querySelector('[data-choice="' + previous + '"]').focus({preventScroll:true});
    });
    const initial = new URLSearchParams(location.search).get('sport');
    if(initial === 'basketball' || initial === 'racing') changeSport(initial);
    else document.querySelectorAll('[data-select]').forEach(button => button.setAttribute('aria-pressed','false'));
  }
  const project = document.body.dataset.project;
  if(project) {
    const item = config[project] || {};
    $('#project-call-title').textContent = item.title || 'Broadcast recording';
    $('#project-status').textContent = item.mediaUrl ? 'Press play to hear the call.' : 'Recording coming soon.';
    renderMedia($('#project-media'),item);
    const labels = {event:'Event',date:'Date',role:'My role',description:'The broadcast',purpose:'Purpose',decisions:'Calling the moment',reflection:'Reflection'};
    Object.entries(labels).forEach(([key,label]) => {
      if(!item[key]) return;
      const section = document.createElement('section'), heading = document.createElement('h3'), text = document.createElement('p');
      heading.textContent = label; text.textContent = item[key]; section.append(heading,text); $('#project-details').append(section);
    });
    if(item.description && item.role && item.reflection) $('.pending-note').hidden = true;
    if(item.transcript) {$('#transcript-section').hidden = false; $('#transcript-text').textContent = item.transcript;}
  }
  if($('#contact-links')) {
    const contact = config.contact || {}, container = $('#contact-links');
    if(contact.email || safeUrl(contact.professionalUrl)) container.replaceChildren();
    if(contact.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      const link = document.createElement('a'); link.href = 'mailto:' + contact.email; link.textContent = contact.email; container.append(link);
    }
    if(safeUrl(contact.professionalUrl)) {
      const link = document.createElement('a'); link.href = contact.professionalUrl; link.textContent = contact.professionalLabel || 'Professional profile'; container.append(link);
    }
  }
})();
