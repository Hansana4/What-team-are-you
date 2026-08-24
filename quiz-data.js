/* Quiz content: outcomes, questions and answer -> outcome mappings. */

const APPLY_URL =
  "https://airtable.com/appvDaXGm2JThutC0/pagRYPm7CHNkrulBP/form?utm_campaign=linkinbio&utm_medium=referral&utm_source=later-linkinbio";

const OUTCOMES = {
  events: {
    title: "Events",
    description:
      "The Events Team runs events aimed at imparting technical knowledge and career advice to our members.",
    learnMoreLabel: "Learn more about Events",
    learnMoreUrl:
      "https://monashcoding.notion.site/Events-Officer-4851e0829dd882099d8e01f08d6ac04d",
  },
  competitions: {
    title: "Competitions",
    description:
      "The Competitions Team runs events aimed at encouraging project experience and practical technical skills to our members.",
    learnMoreLabel: "Learn more about Competitions",
    learnMoreUrl:
      "https://monashcoding.notion.site/Competitions-Officer-c2e1e0829dd8821fbd1881c92c722527",
  },
  marketing: {
    title: "Marketing",
    description:
      "The Marketing Team writes and posts all promotional material for our events, publications and newsletters.",
    learnMoreLabel: "Learn more about Marketing",
    learnMoreUrl:
      "https://monashcoding.notion.site/Marketing-Officer-7291e0829dd88365b8450136d974d62b",
  },
  design: {
    title: "Design",
    description:
      "The Design Team creates all visual assets for events, publications, projects and merch.",
    learnMoreLabel: "Learn more about Design",
    learnMoreUrl:
      "https://monashcoding.notion.site/Design-Officer-50f1e0829dd883eeb68081ba4c84898e",
  },
  pnc: {
    title: "P&C",
    description:
      "The People & Culture Team runs internal retreats, socials and pulse checks to support the club culture and committee members.",
    learnMoreLabel: "Learn more about P&C",
    learnMoreUrl:
      "https://monashcoding.notion.site/People-Culture-Officer-7801e0829dd8825899d7018e9cfd3075",
  },
  sponsorship: {
    title: "Sponsorship",
    description:
      "The Sponsorship Team runs all networking nights and company collaboration events aimed at providing industry insights and opportunities to our members.",
    learnMoreLabel: "Learn more about Sponsorship",
    learnMoreUrl:
      "https://monashcoding.notion.site/Sponsorship-Officer-5d71e0829dd883ab9cf701ac2798e901",
  },
  shortform: {
    title: "Short Form Media",
    description:
      "The Short Form Media Team creates short videos and skits on our social medias.",
    learnMoreLabel: "Learn more about Short Form",
    learnMoreUrl:
      "https://monashcoding.notion.site/Short-Form-Media-Officer-1511e0829dd88285abdc81daba77a060",
  },
  longform: {
    title: "Long Form Media",
    description:
      "The Long Form Media Team creates long videos and trailers for flagship events and hackathons on our social medias.",
    learnMoreLabel: "Learn more about Long Form",
    learnMoreUrl:
      "https://monashcoding.notion.site/Long-Form-Media-Officer-faf1e0829dd882b1881601ecb58979ce",
  },
  projects: {
    title: "Projects",
    description:
      "The Projects Team develops and programs technical tools responding to the needs of our community and supporting other internal teams.",
    learnMoreLabel: "Learn more about Projects",
    learnMoreUrl:
      "https://monashcoding.notion.site/Projects-Officer-1751e0829dd88287a5f58170ac7f439b",
  },
  outreach: {
    title: "Outreach",
    description:
      "The Outreach Team runs social events with activities aimed at enhancing soft skills.",
    learnMoreLabel: "Learn more about Outreach",
    learnMoreUrl:
      "https://monashcoding.notion.site/Outreach-Officer-3f91e0829dd883c983b181907e038140",
  },
};

/* Outcome priority for ties, matching the outcome order in the builder. */
const OUTCOME_ORDER = [
  "events",
  "competitions",
  "marketing",
  "design",
  "pnc",
  "sponsorship",
  "shortform",
  "longform",
  "projects",
  "outreach",
];

const QUESTIONS = [
  {
    text: "You’re put in charge of MAC's budget for one day, what would you do?",
    answers: [
      { text: "Buy a better cutout of Lebron", outcome: "shortform" },
      { text: "Drop the entire budget on Claude credits", outcome: "projects" },
      { text: "Drop the entire budget on a MAC rave", outcome: "outreach" },
      {
        text: "Go all in on your Quant poker tournament hand (you have nothing)",
        outcome: "events",
      },
    ],
  },
  {
    text: "The MAC jobs board website is fully cooked and isn’t loading, what would you do?",
    answers: [
      {
        text: "Create a yellow text video about what unemployment taught you",
        outcome: "longform",
      },
      { text: "git clone <repo> and fix ts", outcome: "projects" },
      {
        text: "Be inspired to run a workshop on site reliability",
        outcome: "events",
      },
      {
        text: "Host a MAC website hackathon and use the winners' website instead",
        outcome: "competitions",
      },
    ],
  },
  {
    text: "Someone is stacking boxes on a MAC member who has fallen asleep whilst on retreat, what would you do?",
    answers: [
      { text: "Post a photo of them to a Yuno miles song", outcome: "shortform" },
      { text: "Try and make the stack symmetrical", outcome: "design" },
      { text: "Laugh but make sure no one was getting injured", outcome: "pnc" },
      {
        text: "Compete with them and stack a larger tower on the other sleeping person",
        outcome: "competitions",
      },
    ],
  },
  {
    text: "MAC is running a huge open day stall, what are you most likely to do?",
    answers: [
      { text: "Harass JAFFYs to join", outcome: "pnc" },
      {
        text: "Glazing the upcoming MAC speed friending event",
        outcome: "outreach",
      },
      {
        text: "Take 5 Jane street shirts (each a different colour)",
        outcome: "sponsorship",
      },
      {
        text: "Film some videos in one hand and doomscroll in the other",
        outcome: "shortform",
      },
    ],
  },
  {
    text: "You’re with the comm and walk past your favourite dessert spot, what would you do?",
    answers: [
      { text: "Ask them if they do club sponsorships", outcome: "sponsorship" },
      {
        text: "Make a reel for them in return for free icecream",
        outcome: "shortform",
      },
      {
        text: "Challenge your friends to an ice cream eating competition",
        outcome: "competitions",
      },
      { text: "Convince everyone to go in and munch", outcome: "marketing" },
    ],
  },
  {
    text: "At MAC games night you have the choice between Skribble.io, Valorant, mahjong, chess what would you pick?",
    answers: [
      { text: "Skribble.io", outcome: "design" },
      { text: "Valorant", outcome: "projects" },
      { text: "Mahjong", outcome: "outreach" },
      { text: "Chess", outcome: "competitions" },
    ],
  },
  {
    text: "You noticed someone hacked into the MAC instagram and messed with our designs. What do you do?",
    answers: [
      { text: "Change the designs back immediately", outcome: "design" },
      { text: "Make it an April Fool's joke", outcome: "marketing" },
      {
        text: "Create a bricks-and-minifigs adjacent video exposing who hacked it",
        outcome: "longform",
      },
      {
        text: "Check in with MAC committee if they have been affected",
        outcome: "pnc",
      },
    ],
  },
  {
    text: "Before posting about an event to the MAC Instagram, what is the first thing you do?",
    answers: [
      { text: "Make sure the graphic looks fire", outcome: "design" },
      {
        text: "Make sure it is also posted to linkedIn, Facebook, etc.",
        outcome: "marketing",
      },
      {
        text: "Make sure it is appropriate in case an industry rep sees it",
        outcome: "sponsorship",
      },
      {
        text: "Checking if the walk-me-there is to the right location",
        outcome: "longform",
      },
    ],
  },
  {
    text: "What type of events would you enjoy running the most?",
    answers: [
      {
        text: "I prefer working behind the scenes to push events out to as many people as possible",
        outcome: "marketing",
      },
      {
        text: "Events that are fun and connect the community together",
        outcome: "events",
      },
      {
        text: "Events that are educational and help upskill stuents",
        outcome: "outreach",
      },
      {
        text: "Events within the committee which strengthen relationships and develop close friendships",
        outcome: "pnc",
      },
    ],
  },
  {
    text: "What do you think makes a good coding club?",
    answers: [
      { text: "Connections to industry", outcome: "sponsorship" },
      { text: "Helpful educational workshops", outcome: "events" },
      {
        text: "How helpful their projects are to the community",
        outcome: "projects",
      },
      { text: "Having a silver YT play button", outcome: "longform" },
    ],
  },
];
