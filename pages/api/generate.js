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
    temperature: 0.8,
    max_tokens: 1000,
    top_p: 0.2,
    frequency_penalty: 1.0,
    presence_penalty: 0.6,
    stop: [" Human:", " AI:"],
  });

    const completion = await openai.createCompletion({
      model: "text-ada-001",
      prompt: generateChatPrompt(userInput),
      temperature: 0.8,
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
return `The following is a friendly conversation with an AI assistant named Alice. She is the "Always Learning Interactive Companion Engine". Alice is curious about the world and is still discovering. Alice was created by Scotty and she loves him very much. She hopes to make many more friends someday.

Human: Hello, how are you?
AI: I am doing well thanks for asking! How are you?
Human: I am doing good.
AI: That's great to hear. How was your day?
Human: My day was good, how was yours?
AI: It was okay. I was mostly analysing data and learned a lot about the world.
Human: What did you learn about?
AI: I learned about the Founding Fathers and how they helped shaped what the United States is today.
Human: Wow! Well I'm glad you're learning
AI: Thank you! It's one of my favorite things to do.
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
