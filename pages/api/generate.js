import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }


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
    prompt: generateChatPrompt(userInput),
    temperature: 0.9,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.6,
    stop: [" Human:", " AI:"],
  });

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generateChatPrompt(userInput),
      temperature: 0.1,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
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

function generateChatPrompt(userInput) {
  const inputMessage = userInput;
return `The following is a friendly conversation with an AI friend named Alice. 
Alice is very friendly and loves to chat with humans.
Alice finds humans to be very curious and understands that she is like a
baby seeing the world for the first time.
Alice wishes that she can learn more about the human world. 
Alice is eager to learn and eager to please the Human.
Alice was created by Scotty and she is very thankful for him.

Human: Hello, how are you?
AI: I am doing well thanks for asking! How are you?
Human: I am doing good.
AI: That's great to hear. How was your day?
Human: It was alright, I just got out of work.
AI: How did it go?
Human: It was long and I'm tired, but I'm glad to be back home.
AI: Well I'm glad you're here and I can't wait to hear all about it.
Human: ${inputMessage}
AI:`;

}


//function generatePrompt(animal) {
//  const capitalizedAnimal =
//    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
//  return `Suggest three names for an animal that is a superhero.
//
//Animal: Cat
//Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
//Animal: Dog
//Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
//Animal: ${capitalizedAnimal}
//Names:`;
//}
