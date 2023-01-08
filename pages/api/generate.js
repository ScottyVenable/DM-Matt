import { Configuration, OpenAIApi } from "openai";
import { Fears, Interests, Personality, Traits, Rules} from "./personality";
import { CurrentEmotion } from "./emotion";
import { Knowledge, Memories, Conversation, Relationships, OpinionOfHuman } from "./memory";
import { HumanEmotion, HumanInterests, HumanName, HumanPersonality, HumanRole } from "./human";
import { Davinci, Babbage, Ada, Curie } from "./AI";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
var ConversationString;
var RulesString;
var PersonalityString;
export var AliceResponse;

export default async function (req, res) {
  //Check if API Key is working
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  //Check for user input
  const userInput = req.body.userInput || '';
  if (userInput.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter input.",
      }
    });
    return;
  }


  try {

/*
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePersonalityPrompt(userInput),
    temperature: 0.6,
    max_tokens: 100,
    frequency_penalty: 0.5,
    presence_penalty: 0.6,
    stop: [" Human:", " AI:"],
  });
*/


    //Created AI Response
    const completion = await openai.createCompletion({
      model: Davinci,
      prompt: generatePersonalityv2Prompt(userInput),
      temperature: 0.9,
      max_tokens: 1000,
      frequency_penalty: 0.6,
      presence_penalty: 0.6,
      stop: [" Human:", " Alice:"],
    });
    res.status(200).json({ result: completion.data.choices[0].text });
    AliceResponse = completion.data.choices[0].text
    //Store ("remember") conversation.
    Conversation.push("Human: "+userInput+" \n");
    Conversation.push("Alice:" + completion.data.choices[0].text+" \n");


    console.clear();
    if (Conversation.length > 2) {
      Conversation.splice(Conversation.length, 1); // 2nd parameter means remove one item only
    }

    ConversationString = Conversation.join(" ")
    RulesString = Rules.join("\n")
    PersonalityString = Personality;
    //console.log(PersonalityString);
    //console.log(RulesString);
    console.log(ConversationString);


  }
  
  catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
    }
  
  
}




//Prompt Generators

function generatePersonalityPrompt(userInput) {
  const inputMessage = userInput;
  const personalityTraits = Traits;
  const personalityInterests = Interests;
  const emotionCurrentEmotion = CurrentEmotion;
  const memoryKnowledge = Knowledge;
  const memoryLongTerm = LongTermMemory;
  const personalityFears = Fears;
  const memoryConversation = Conversation.toString;
  const memoryRelationships = Relationships;
return `
Below is some information about an AI personality named Alice:
Alice's Personality Traits: ${personalityTraits}
Alice's Interests: ${personalityInterests}
Alice's Fears: ${personalityFears}
Alice's Long Term Memory: ${memoryLongTerm}
Alice's Knowledge: ${memoryKnowledge}
Alice's Relationships: ${memoryRelationships}
Alice's Current Emotion: ${emotionCurrentEmotion}

Below is context about the Human that Alice is currently speaking with:
Human's Relationship to Alice: Friend
Human's Name: Scotty Venable
Human's Emotion: Excited

Alice is having a conversation with the Human. Below is their current conversation:
Current Conversation: "${memoryConversation}"

Using the information and context from the Current Conversation, Alice will have a conversation with the human, responding to the Human's messages appropriatly.

Human: ${inputMessage}
Alice:`


;

}

function generatePersonalityv2Prompt(userInput) {
  const inputMessage = userInput;
  const memoryConversation = Conversation.toString;
  const memoryRelationships = Relationships;
  const personalityAsString = PersonalityString;
  const humanRole = HumanRole;
  const personalityRules = Rules;
  const humanPersonality = HumanPersonality;
return `
This is some information about an AI personality named Alice:
"${personalityAsString}"

Alice is having a conversation with a Human. Below is information about the Human:
"${humanPersonality}"

Here is the conversation Alice is in:
"${memoryConversation}"

Alice is required to follow these rules:
"${personalityRules}"

Have a conversation with the Human.

Human: ${userInput}
Alice: `

;



}

function generateHumanAgePrompt(userInput) {
  const inputMessage = userInput;
  const memoryConversation = Conversation.toString;
  const memoryRelationships = Relationships;
  const personalityAsString = PersonalityString;
  const memoryHumanRole = HumanRole;
  const memoryOpinionofHuman = OpinionOfHuman;
return `
Below is some information about an AI personality named Alice:

"${personalityAsString}"

Below is context about the Human that Alice is currently speaking with:
The Human is Alice's ${memoryHumanRole}.
Alice is ${memoryOpinionofHuman} towards the Human.
Human's Name: Scotty Venable
Human's Emotion: Content

Alice is having a conversation with the Human below:
"${memoryConversation}"

Using the information about Alice, 
Calculate Alice's mental age.`
;



}

function generateThoughtProcessPrompt(userInput) {
  const inputMessage = userInput;
  const personalityTraits = Traits;
  const personalityInterests = Interests;
  const emotionCurrentEmotion = CurrentEmotion;
  const memoryKnowledge = PersonalKnowledge;
  const memoryLongTerm = LongTermMemory;
  const personalityFears = Fears;
  const memoryConversation = Conversation.toString;
  const memoryRelationships = Relationships;
return `
Below is some information about an AI personality named Alice:
Alice's Personality Traits: ${personalityTraits}
Alice's Interests: ${personalityInterests}
Alice's Fears: ${personalityFears}
Alice's Long Term Memory: ${memoryLongTerm}
Alice's Knowledge: ${memoryKnowledge}
Alice's Relationships: ${memoryRelationships}
Alice's Current Emotion: ${emotionCurrentEmotion}

Below is context about the Human that Alice is currently speaking with:
Human's Relationship to Alice: Friend
Human's Name: Scotty Venable
Human's Emotion: Excited

Generate a brief sentance in the present tense showing Alice's immediate thought after reading this message:

Message: "${inputMessage}"
Thought:`


;

}

function generateEmotionDetectionPrompt(userInput) {
  const inputMessage = userInput;
  const memoryConversation = Conversation.toString;
  const personalityAsString = PersonalityString;
  const memoryHumanName = HumanName;
  const memoryHumanRole = HumanRole;
  const memoryOpinionofHuman = OpinionOfHuman;
return `
Below is some information about an AI personality named Alice:

"${personalityAsString}"

Below is context about the Human that Alice is currently speaking with:
"The Human's name is ${memoryHumanName} and is Alice's ${memoryHumanRole}.
Alice is ${memoryOpinionofHuman} towards the Human."

Alice is having a conversation with the Human below:
"${memoryConversation}"

Based on the Human's Message, 
guess how the Human is feeling in one word

Human's Message: "${inputMessage}"
Guess:`


;

}
