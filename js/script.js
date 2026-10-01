/* =========================================================
   Octobre Rose 2026 — Côte d'Ivoire
   JavaScript vanilla · aucun import externe · aucune donnée envoyée
   ========================================================= */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ---------- 1. Mode sombre / clair ---------- */
  function initTheme() {
    var btn = $('#theme-toggle');
    if (!btn) return;
    var root = document.documentElement;

    function label(theme) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre');
    }
    label(root.getAttribute('data-theme'));

    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      label(next);
      try { localStorage.setItem('octobre-rose-theme', next); } catch (e) {}
    });
  }

  /* ---------- 2. Menu mobile ---------- */
  function initNav() {
    var toggle = $('#nav-toggle');
    var menu = $('#nav-menu');
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      var text = $('.sr-only', toggle);
      if (text) text.textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
    }
    function isOpen() { return toggle.getAttribute('aria-expanded') === 'true'; }

    toggle.addEventListener('click', function () { setOpen(!isOpen()); });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768 && isOpen()) setOpen(false);
    });
  }

  /* ---------- 3. Défilement fluide + focus ---------- */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start'
      });
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });

      history.pushState(null, '', id);
    });
  }

  /* ---------- 4. Retour en haut ---------- */
  function initBackToTop() {
    var btn = $('#back-to-top');
    if (!btn) return;
    var ticking = false;

    function update() {
      btn.classList.toggle('is-visible', window.scrollY > 400);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    update();

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      var header = $('#top');
      if (header) header.setAttribute('tabindex', '-1'), header.focus({ preventScroll: true });
    });
  }

  /* ---------- 5. Apparition des sections ---------- */
  function initReveal() {
    var items = $$('.section .container, .hero-grid');
    items.forEach(function (el) { el.classList.add('reveal'); });

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 6. Lien de nav actif ---------- */
  function initActiveNav() {
    if (!('IntersectionObserver' in window)) return;
    var links = {};
    $$('.nav-menu a[href^="#"]').forEach(function (a) {
      links[a.getAttribute('href').slice(1)] = a;
    });
    var sections = Object.keys(links)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    if (!sections.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = links[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Object.keys(links).forEach(function (id) { links[id].removeAttribute('aria-current'); });
          link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- 7. FAQ accordéon ---------- */
  function initAccordions() {
    var triggers = $$('.accordion-trigger');
    triggers.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (!panel) return;

        // Ferme les autres panneaux du même accordéon
        triggers.forEach(function (other) {
          if (other === btn) return;
          other.setAttribute('aria-expanded', 'false');
          var otherPanel = document.getElementById(other.getAttribute('aria-controls'));
          if (otherPanel) otherPanel.hidden = true;
        });

        btn.setAttribute('aria-expanded', String(!expanded));
        panel.hidden = expanded;
      });
    });
  }

  /* ---------- 8. Idées reçues (cartes retournables) ---------- */
  function initFlipCards() {
    var cards = $$('.flip-card-inner');
    cards.forEach(function (card) {
      function toggle() {
        var flipped = card.classList.toggle('is-flipped');
        card.setAttribute('aria-pressed', String(flipped));
        if (flipped) {
          cards.forEach(function (other) {
            if (other !== card && other.classList.contains('is-flipped')) {
              other.classList.remove('is-flipped');
              other.setAttribute('aria-pressed', 'false');
            }
          });
        }
      }
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  /* ---------- 9. Quiz ---------- */
  var QUESTIONS = [
    {
      q: 'Quel est le cancer le plus fréquent chez la femme en Côte d\'Ivoire ?',
      options: ['Le cancer du col de l\'utérus', 'Le cancer du sein', 'Le cancer du foie', 'Le cancer du poumon'],
      answer: 1,
      explanation: 'Le cancer du sein constitue le premier cancer chez la femme en Côte d\'Ivoire.',
      source: 'Ministère de la Santé, de l\'Hygiène Publique et de la Couverture Maladie Universelle — Côte d\'Ivoire'
    },
    {
      q: 'Selon les estimations GLOBOCAN 2022, combien de nouveaux cas de cancer du sein étaient estimés en Côte d\'Ivoire ?',
      options: ['869 cas', '3 869 cas', '21 352 cas', '213 000 cas'],
      answer: 1,
      explanation: 'Les estimations GLOBOCAN 2022 citées par le Ministère de la Santé évaluent à 3 869 les nouveaux cas, et à 2 092 les décès liés au cancer du sein. Ce sont des estimations, pas le nombre de cas enregistrés en 2026.',
      source: 'Ministère de la Santé CI · GLOBOCAN 2022'
    },
    {
      q: 'Le cancer du sein peut-il toucher les hommes ?',
      options: ['Non, jamais', 'Oui, mais c\'est beaucoup plus rare', 'Oui, aussi souvent que les femmes', 'Seulement après 80 ans'],
      answer: 1,
      explanation: 'Les hommes possèdent du tissu mammaire et peuvent développer un cancer du sein, même si les cas restent beaucoup plus rares.',
      source: 'OMS'
    },
    {
      q: 'Que faire si vous découvrez une boule dans votre sein ?',
      options: ['Attendre qu\'elle disparaisse', 'Consulter un professionnel de santé sans tarder', 'Prendre des remèdes traditionnels d\'abord', 'Ça veut forcément dire un cancer, inutile de consulter'],
      answer: 1,
      explanation: 'Toute grosseur persistante doit être examinée. La plupart des masses ne sont pas cancéreuses, mais seul un professionnel de santé peut évaluer le signe.',
      source: 'OMS'
    },
    {
      q: 'Laquelle de ces situations justifie un avis médical ?',
      options: ['Un écoulement sanglant par le mamelon', 'Une bosse qui apparaît et disparaît en un jour', 'Une petite varique sur le sein', 'Se sentir fatiguée un jour'],
      answer: 0,
      explanation: 'Un écoulement, surtout s\'il est sanglant, fait partie des signes à connaître, au même titre qu\'une masse, une modification de la forme, de la peau ou du mamelon.',
      source: 'OMS'
    },
    {
      q: 'Qu\'est-ce que la « Mammomobile » reçue par la Côte d\'Ivoire en mars 2026 ?',
      options: ['Une application de rendez-vous', 'Une unité publique de mammographie mobile', 'Un laboratoire d\'analyses', 'Une association de patients'],
      answer: 1,
      explanation: 'La Mammomobile est la première unité publique de mammographie mobile du pays. Équipée d\'un mammographe et d\'un échographe, elle vise à rapprocher les services de diagnostic des populations.',
      source: 'Ministère de la Santé CI — mars 2026'
    },
    {
      q: 'Un résultat anormal à la mammographie signifie-t-il qu\'on a un cancer ?',
      options: ['Oui, toujours', 'Non : des examens complémentaires sont nécessaires', 'Oui, dans 90 % des cas', 'Cela dépend du jour de la semaine'],
      answer: 1,
      explanation: 'Un résultat anormal appelle des examens complémentaires (échographie, parfois d\'autres examens). Seuls ces examens, interprétés par des professionnels, permettent de poser un diagnostic.',
      source: 'OMS'
    },
    {
      q: 'Lequel de ces facteurs de risque est identifié par l\'OMS ?',
      options: ['La consommation d\'alcool', 'Raconter des histoires', 'Boire du lait de coco', 'Dormir sur le côté gauche'],
      answer: 0,
      explanation: 'L\'OMS cite parmi les facteurs de risque : l\'âge, l\'obésité, l\'usage nocif de l\'alcool, les antécédents familiaux, le tabagisme, l\'exposition aux radiations et le traitement hormonal post-ménopause.',
      source: 'OMS'
    },
    {
      q: 'Que vise le dépistage ?',
      options: ['À soigner déjà la maladie', 'À détecter une maladie avant l\'apparition des symptômes', 'À guérir tous les cancers automatiquement', 'À remplacer la consultation médicale'],
      answer: 1,
      explanation: 'Le dépistage cherche à trouver une maladie chez une personne qui se sent en bonne santé, avant l\'apparition des symptômes, pour agir plus tôt.',
      source: 'OMS'
    },
    {
      q: 'L\'observation de ses seins suffit-elle à elle seule ?',
      options: ['Oui, c\'est suffisant à 100 %', 'Non : elle ne remplace pas les examens réalisés par un professionnel', 'Oui, si on le fait tous les jours', 'Seulement après 70 ans'],
      answer: 1,
      explanation: 'Connaître ses seins aide à repérer un changement, mais l\'observation ne remplace ni un examen clinique ni les examens d\'imagement proposés par un professionnel de santé.',
      source: 'OMS'
    }
  ];

  function initQuiz() {
    var root = $('#quiz-root');
    var status = $('#quiz-status');
    if (!root) return;

    var state = { index: 0, score: 0, answered: false };

    function announce(text) { if (status) status.textContent = text; }

    function renderQuestion() {
      state.answered = false;
      var q = QUESTIONS[state.index];
      var letters = ['A', 'B', 'C', 'D'];

      root.innerHTML = '';
      root.setAttribute('role', 'group');
      root.setAttribute('aria-label', 'Quiz sur le cancer du sein');

      var progress = document.createElement('div');
      progress.className = 'quiz-progress';
      progress.innerHTML = '<span>Question ' + (state.index + 1) + ' / ' + QUESTIONS.length + '</span>';
      root.appendChild(progress);

      var bar = document.createElement('div');
      bar.className = 'quiz-bar';
      bar.setAttribute('aria-hidden', 'true');
      var fill = document.createElement('div');
      fill.className = 'quiz-bar-fill';
      fill.style.width = Math.round((state.index / QUESTIONS.length) * 100) + '%';
      bar.appendChild(fill);
      root.appendChild(bar);

      var fieldset = document.createElement('fieldset');
      var legend = document.createElement('legend');
      legend.textContent = q.q;
      fieldset.appendChild(legend);

      var list = document.createElement('ul');
      list.className = 'quiz-options';

      q.options.forEach(function (opt, i) {
        var li = document.createElement('li');
        li.className = 'quiz-option';
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = 'q' + state.index;
        input.id = 'q' + state.index + '-opt' + i;
        input.value = String(i);
        var label = document.createElement('label');
        label.setAttribute('for', input.id);
        label.innerHTML = '<span class="opt-letter" aria-hidden="true">' + letters[i] + '</span><span>' + opt + '</span>';
        li.appendChild(input);
        li.appendChild(label);
        list.appendChild(li);
      });

      fieldset.appendChild(list);
      root.appendChild(fieldset);

      var actions = document.createElement('div');
      actions.className = 'quiz-actions';
      var validate = document.createElement('button');
      validate.type = 'button';
      validate.className = 'btn btn-primary';
      validate.textContent = 'Valider';
      validate.addEventListener('click', function () { validate$(); });
      actions.appendChild(validate);
      root.appendChild(actions);

      function validate$() {
        var checked = root.querySelector('input[name="q' + state.index + '"]:checked');
        if (!checked) {
          announce('Veuillez sélectionner une réponse avant de valider.');
          var first = root.querySelector('input[name="q' + state.index + '"]');
          if (first) first.focus();
          return;
        }
        state.answered = true;
        var chosen = parseInt(checked.value, 10);
        var correct = chosen === q.answer;

        if (correct) state.score++;

        $$('.quiz-option', root).forEach(function (li, i) {
          var input = li.querySelector('input');
          input.disabled = true;
          if (i === q.answer) li.classList.add('is-correct');
          if (i === chosen && !correct) li.classList.add('is-wrong');
        });

        var feedback = document.createElement('div');
        feedback.className = 'quiz-feedback ' + (correct ? 'is-correct' : 'is-wrong');
        feedback.setAttribute('role', 'status');
        feedback.innerHTML =
          '<p class="fb-title">' + (correct ? '✔ Bonne réponse' : '✘ Réponse incorrecte') + '</p>' +
          '<p>' + q.explanation + '</p>' +
          '<p class="fb-source">Source : ' + q.source + '</p>';
        root.insertBefore(feedback, actions);

        validate.remove();

        var next = document.createElement('button');
        next.type = 'button';
        next.className = 'btn btn-primary';
        next.textContent = state.index === QUESTIONS.length - 1 ? 'Voir mon résultat' : 'Question suivante';
        next.addEventListener('click', function () {
          if (state.index === QUESTIONS.length - 1) {
            renderResult();
          } else {
            state.index++;
            renderQuestion();
            root.querySelector('.quiz legend').focus && root.querySelector('.quiz legend').focus();
          }
        });
        actions.appendChild(next);
        next.focus();

        announce((correct ? 'Bonne réponse. ' : 'Réponse incorrecte. ') + q.explanation);
      }
    }

    function renderResult() {
      var total = QUESTIONS.length;
      var pct = Math.round((state.score / total) * 100);
      var msg;
      if (state.score >= 8) {
        msg = 'Excellent ! Vous maîtrisez bien l\'essentiel.';
      } else if (state.score >= 5) {
        msg = 'Bien ! Quelques révisions et ce sera parfait.';
      } else {
        msg = 'Continuez à vous informer auprès de sources fiables.';
      }

      root.innerHTML =
        '<div class="quiz-result">' +
        '<p class="quiz-progress"><span>Votre résultat</span></p>' +
        '<div class="quiz-score" style="--score-pct:' + pct + '" role="img" aria-label="Score : ' + state.score + ' sur ' + total + '">' +
        state.score + '<small>/' + total + '</small>' +
        '</div>' +
        '<h3>' + msg + '</h3>' +
        '<p>Merci d\'avoir participé. Ce score est un support pédagogique : il ne constitue pas une évaluation médicale.</p>' +
        '<div class="quiz-actions" style="justify-content:center">' +
        '<button type="button" class="btn btn-primary" id="quiz-restart">Recommencer le quiz</button>' +
        '<a class="btn btn-ghost" href="#signes">Revoir les signes</a>' +
        '</div></div>';

      var restart = $('#quiz-restart');
      if (restart) {
        restart.addEventListener('click', function () {
          state = { index: 0, score: 0, answered: false };
          renderQuestion();
          announce('Quiz recommencé. Question 1 sur ' + QUESTIONS.length + '.');
        });
        restart.focus();
      }
      announce('Votre résultat : ' + state.score + ' sur ' + total + '. ' + msg);
    }

    renderQuestion();
  }

  /* ---------- Initialisation ---------- */
  function init() {
    initTheme();
    initNav();
    initSmoothScroll();
    initBackToTop();
    initReveal();
    initActiveNav();
    initAccordions();
    initFlipCards();
    initQuiz();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
