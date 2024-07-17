import React, { useState } from "react";
import axios from "axios";

function AskGemini(props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleQuestion = (event) => {
    setQuestion(event.target.value);
  };

  const generateAns = async () => {
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${import.meta.env.VITE_API_KEY}`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });
      setAnswer(response.data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error("Error generating answer:", error);
    }
  };

  const myStyle = {
    backgroundColor: props.mode === "dark" ? "#333" : "#fff",
    color: props.mode === "dark" ? "#fff" : "#000",
  };

  return (
    <div>
      <h1 className="my-3" style={{ color: props.mode === "dark" ? "white" : "#042743" }}>
        Ask Gemini
      </h1>
      <br />
      <br />
      <textarea
        className="form-control"
        rows="8"
        value={question}
        style={myStyle}
        onChange={handleQuestion}
      ></textarea>
      <br />
      <br />
      <button onClick={generateAns} id="genansbtn">
        Generate answer
      </button>
      <br />
      <br />
      <h2 style={{ color: props.mode === "dark" ? "white" : "#042743" }}>Response</h2>
      <br />
      <p style={myStyle}>{answer}</p>
    </div>
  );
}

export default AskGemini;
