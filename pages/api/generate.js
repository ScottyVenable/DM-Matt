import { Configuration, OpenAIApi } from "openai";
import { Interests, Traits, CurrentEmotion } from "./personality";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

var humanMessages = []
var AIMessages = []
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

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePersonalityPrompt(userInput),
    temperature: 0.8,
    max_tokens: 200,
    frequency_penalty: 0.5,
    presence_penalty: 0.6,
    stop: [" Human:", " AI:"],
  });



    //Created AI Response
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePersonalityPrompt(userInput),
      temperature: 0.8,
      max_tokens: 200,
      frequency_penalty: 0.5,
      presence_penalty: 0.6,
      stop: [" Human:", " AI:"],
    });
    res.status(200).json({ result: completion.data.choices[0].text });

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
  const personalityCurrentEmotion = personalityCurrentEmotion;
return `The following is a conversation with an AI assistant named Alice.
Alice's Personality Traits: ${personalityTraits}
Alice's Interests: ${personalityInterests}
Alice's Current Emotion: ${personalityCurrentEmotion}

Human: ${inputMessage}
AI:`;

}




/*
function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}
*/
