import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import { Conversation, ShortTermMemory } from "./api/memory";
import { Emotion } from "./api/emotion";
import { CurrentEmotion } from "./api/emotion";

export default function Home() {
  const [humanInput, setHumanInput] = useState("");
  const [result, setResult] = useState();
  const [emotion, setEmotion] = useState();
  const [humanMessage, setHumanMessage] = useState();
  //Generate Response to the input
  async function onSubmit(event) {
    setHumanInput("");
    event.preventDefault();
    //Create AI Response
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: humanInput }),
      });
      
      
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);

    }
    catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }

  } 
  return (
    <div>
      <Head>
        <title>Alice AI - Always Learning Interactive Companion Engine</title>
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className={styles.main}>
        <img src="/logo.png" className={styles.icon} />
        <h3>A . L . I . C . E</h3>
        <h4>Always Learning Interactive Companion Engine</h4>

        <fieldset>
          <legend><b>A.L.I.C.E</b> *{CurrentEmotion}*</legend>
          <div className={styles.result}>{result}</div>
        </fieldset>
      
      
      





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

  //Generate an Emotion based on the input recieved.

  //Site Design

}
