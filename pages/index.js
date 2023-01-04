import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [humanInput, setHumanInput] = useState("");
  const [result, setResult] = useState();
  const [emotion, setEmotion] = useState();

  async function onSubmit(event) {

    setHumanInput("");
    event.preventDefault();

    //Create AI Response
    try {
      const AIresponse = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: humanInput }),
      });
      
      
      const AIdata = await AIresponse.json();
      if (AIresponse.status !== 200) {
        throw AIdata.error || new Error(`Request failed with status ${AIresponse.status}`);
      }

      setResult(AIdata.result);


    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }

    //Set Emotion
    /*
    try {

      const emotionResponse = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: humanInput }),
      });
      
      
      const emotionalData = await AIresponse.json();
      if (AIresponse.status !== 200) {
        throw emotionalData.error || new Error(`Request failed with status ${AIresponse.status}`);
      }

      setEmotion(emotionalData.result);
    

    }
    */
  } 
  return (
    <div>
      <Head>
        <title>ALICE - Always Learning Interactive Companion Engine</title>
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className={styles.main}>
        <img src="/logo.png" className={styles.icon} />
        <h3>A . L . I . C . E</h3>
        <div className={styles.result}>{result}</div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="userInput"
            placeholder="Send a message..."
            value={humanInput}
            onChange={(e) => setHumanInput(e.target.value)}
          />
          <input type="submit" value="Send" />
        </form>
        
      </main>
    </div>
  );
}
