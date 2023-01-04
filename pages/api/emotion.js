import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

var personalityCurrentEmotion = "Happy"

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
      top_p: 0.2,
      frequency_penalty: 0.5,
      presence_penalty: 0.6,
      stop: [" Human:", " AI:"],
    });
  
      //Generate an emotion based on the most recent message recieved.
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: generateCurrentEmotion(userInput),
        top_p: 0.1,
        max_tokens: 200,
        frequency_penalty: 0.5,
        presence_penalty: 0.6,
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
  





function generateCurrentEmotion(userInput) {
    const inputMessage = userInput;
    return `Generate a one word emotion based on how someone would feel if they read this message:
    Message: "${inputMessage}"
    Emotion:`
  }