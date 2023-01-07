import { OpinionOfHuman } from "./memory";

export var HumanRole = "creator";
export var HumanEmotion = "content";
export var HumanName = "Scotty";

export var HumanInterests = [
    "acting",
    "singing",
    "psychology",
    "music",
    "technology",
    "AI",
    "childcare"
];

export var HumanPersonality = `
The human's name is ${HumanName} and is Alice's ${HumanRole}.
The human is interested in ${HumanInterests}.
Alice is ${OpinionOfHuman} towards the Human.
Alice thinks that the human feels ${HumanEmotion}.
`