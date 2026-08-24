/* Quiz flow: one question per screen, one point per answer, highest score wins. */

(function () {
  const card = document.getElementById("card");
  const scores = {};
  let index = 0;

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
  }

  function choose(answer) {
    scores[answer.outcome] += 1;
    index += 1;

    if (index < QUESTIONS.length) {
      renderQuestion();
    } else {
      renderOutcome(winner());
    }

    window.scrollTo({ top: 0 });
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
    document.title = outcome.title + " | What team are you?";
  }

  function link(label, href) {
    const anchor = document.createElement("a");
    anchor.className = "btn";
    anchor.href = href;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = label;
    return anchor;
  }

  renderQuestion();
})();
