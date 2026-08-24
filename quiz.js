/* Quiz flow: one question per screen, one point per answer, highest score wins. */

(function () {
  const card = document.getElementById("card");
  const scores = {};
  let index = 0;

  /* Inside a Notion embed (or any iframe) the page gets a compact layout and
     link clicks are escorted out of the frame. ?embed=1 forces it on. */
  const embedded = isEmbedded();
  if (embedded) {
    document.documentElement.classList.add("is-embedded");
  }

  function isEmbedded() {
    if (/[?&]embed=1\b/.test(window.location.search)) return true;
    try {
      return window.self !== window.top;
    } catch (error) {
      /* Cross-origin parent — reading window.top throws, so we are framed. */
      return true;
    }
  }

  OUTCOME_ORDER.forEach((key) => (scores[key] = 0));

  function renderQuestion() {
    const question = QUESTIONS[index];

    const heading = document.createElement("h1");
    heading.className = "question";
    heading.textContent = index + 1 + ". " + question.text;

    const options = document.createElement("div");
    options.className = "options";

    question.answers.forEach((answer) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option";
      button.textContent = answer.text;
      button.addEventListener("click", () => choose(answer));
      options.appendChild(button);
    });

    card.replaceChildren(heading, options);
    resetScroll();
  }

  function choose(answer) {
    scores[answer.outcome] += 1;
    index += 1;

    if (index < QUESTIONS.length) {
      renderQuestion();
    } else {
      renderOutcome(winner());
    }
  }

  /* Scrolls the iframe's own document, never the embedding page. */
  function resetScroll() {
    const scroller = document.scrollingElement || document.documentElement;
    if (scroller) scroller.scrollTop = 0;
  }

  function winner() {
    return OUTCOME_ORDER.reduce((best, key) =>
      scores[key] > scores[best] ? key : best
    );
  }

  function renderOutcome(key) {
    const outcome = OUTCOMES[key];

    const logo = document.createElement("img");
    logo.className = "outcome-logo";
    logo.src = "assets/mac_logo.png";
    logo.alt = "";

    const title = document.createElement("h1");
    title.className = "outcome-title";
    title.textContent = outcome.title;

    const description = document.createElement("p");
    description.className = "outcome-description";
    description.textContent = outcome.description;

    const actions = document.createElement("div");
    actions.className = "outcome-actions";
    actions.appendChild(link("Apply for MAC!", APPLY_URL));
    actions.appendChild(link(outcome.learnMoreLabel, outcome.learnMoreUrl));

    card.replaceChildren(logo, title, description, actions);
    resetScroll();
    document.title = outcome.title + " | What team are you?";
  }

  function link(label, href) {
    const anchor = document.createElement("a");
    anchor.className = "btn";
    anchor.href = href;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = label;
    if (embedded) {
      anchor.addEventListener("click", openOutsideFrame);
    }
    return anchor;
  }

  /* Some embed hosts sandbox popups. Try a new tab first, then break out of
     the frame, then fall back to navigating the frame itself. */
  function openOutsideFrame(event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const href = event.currentTarget.href;
    event.preventDefault();

    const opened = window.open(href, "_blank", "noopener,noreferrer");
    if (opened) return;

    try {
      window.top.location.href = href;
    } catch (error) {
      window.location.href = href;
    }
  }

  renderQuestion();
})();
