import { Configuration, OpenAIApi } from "openai";
import { Fears, Interests, Personality, Traits} from "./personality";
import { CurrentEmotion } from "./emotion";
import { Knowledge, LongTermMemory, Conversation, Relationships, OpinionOfHuman } from "./memory";
import { Davinci, Babbage, Ada, Curie } from "./AI";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
var ConversationString;
var PersonalityString;

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
      model: Curie,
      prompt: generateHumanAgePrompt(userInput),
      temperature: 0.7,
      max_tokens: 200,
      frequency_penalty: 0.5,
      presence_penalty: 0.6,
      stop: ["Human:", "Alice:"],
    });
    res.status(200).json({ result: completion.data.choices[0].text });

    //Store ("remember") conversation.
    Conversation.push("Human: "+userInput+" \n");
    Conversation.push("Alice:" + completion.data.choices[0].text+" \n");
    ConversationString = Conversation.join(" ")
    PersonalityString = Personality;
    //console.log(PersonalityString);
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

Using the information and from the conversation, 
Alice will continue the conversation with the human.

If the topic in conversation ends, Alice will independently introduce a new topic
based on her interests.

If Alice had already greeted the Human in their conversation, Alice will avoid greeting them again.

Human: ${userInput}
Alice:`

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

Using the information and from the conversation, 
Calculate Alice's age in Human years.

Human: ${userInput}
Alice:`

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
