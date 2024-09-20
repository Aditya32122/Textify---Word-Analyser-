import React, { useState, useEffect, useRef } from "react";

function Textform(props) {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);


    // New state variables
    const [findWord, setFindWord] = useState('');
    const [replaceWord, setReplaceWord] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('es'); // Example: Spanish
    const [readabilityScore, setReadabilityScore] = useState(0);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Try using Chrome.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setText((prevText) => prevText + transcript + ' ');
        } else {
          interimTranscript += transcript;
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handlespeechtotext = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleuppercase = () => {
    const newText = text.toUpperCase();
    setText(newText);
    props.showAlert('Converted to uppercase!', 'success');
  };

  const handlelowercase = () => {
    let lower = text.toLowerCase();
    setText(lower);
    props.showAlert("Converted to lowercase!", "success");
  };

  const handleOnChange = (event) => {
    setText(event.target.value);
  };

  const handleclear = () => {
    let newtext = '';
    setText(newtext);
    props.showAlert("Text cleared", "warning");
  };

  const handlecopy = () => {
    navigator.clipboard.writeText(text);
    props.showAlert("Copied to Clipboard!", "success");
  };

  const speak = () => {
    let msg = new SpeechSynthesisUtterance();
    msg.text = text;
    window.speechSynthesis.speak(msg);
  };

  const handleExtraSpaces = () => {
    let newText = text.split(/[ ]+/);
    setText(newText.join(" "));
    props.showAlert("Extra spaces removed!", "success");
  };
  //new
  const handleReplace = () => {
    const newText = text.replaceAll(findWord, replaceWord);
    setText(newText);
    props.showAlert("Text replaced successfully!", "success");
  };

  const calculateReadability = () => {
    const sentences = text.split(/[.?!]\s/).filter((s) => s.length > 0).length;
    const words = text.split(/\s+/).filter((word) => word.length > 0).length;
    const syllables = text.match(/[aeiouy]{1,2}/g)?.length || 0; // Rough estimation of syllables

    const fleschKincaidScore = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    setReadabilityScore(fleschKincaidScore.toFixed(2));
  };


  return (
    <>
      <div className="container" style={{ color: props.mode === 'dark' ? 'white' : '#042743' }}>
        <div className="mb-3">
          <h1>Enter the text below:</h1>
          <label htmlFor="textarealabel" className="label"></label>
          <textarea
            className="form-control"
            id="textarea"
            value={text}
            rows="8"
            onChange={handleOnChange}
            style={{ backgroundColor: props.mode === 'dark' ? '#13466e' : 'white', color: props.mode === "dark" ? "white" : '#042743' }}
          ></textarea><br />
          <button id="touppercasebtn" onClick={handleuppercase}> Convert to Upper Case</button>
          <button id="tolowercasebtn" onClick={handlelowercase}> Convert to Lower Case</button>
          <button id="clearbtn" onClick={handleclear}>Clear Text</button>
          <button id="copybtn" onClick={handlecopy}>Copy Text</button>
          <button id="speak" onClick={speak}>Read Aloud</button>
          <button id="extraspaces" disabled={text.length === 0} onClick={handleExtraSpaces}>Remove Extra Spaces</button>
          <button id="speachtotextbtn" onClick={handlespeechtotext} disabled={isListening}>
            {isListening ? "Listening..." : "Start Listening"}
          </button>
          <button id="stoplisteningbtn" onClick={handleStopListening} disabled={!isListening}>Stop Listening</button>
        </div>
      </div>
          
                 {/* New Features */}
                 <div className="features-container">
            {/* Find and Replace Section */}
            <div className="find-replace">
              <input
                type="text"
                placeholder="Find"
                className="input-text"
                value={findWord}
                onChange={(e) => setFindWord(e.target.value)}
                style={{
                  backgroundColor: props.mode === 'dark' ? '#13466e' : 'white',
                  color: props.mode === 'dark' ? 'white' : '#042743'
                }}
              />
              <input
                type="text"
                placeholder="Replace"
                className="input-text"
                value={replaceWord}
                onChange={(e) => setReplaceWord(e.target.value)}
                style={{
                  backgroundColor: props.mode === 'dark' ? '#13466e' : 'white',
                  color: props.mode === 'dark' ? 'white' : '#042743'
                }}
              />
              <button id="Replace" className="btn" onClick={handleReplace}>
                Replace
              </button>
            </div>

            {/* Readability Score Section */}
            <div className="readability-score">
              <button className="btn" onClick={calculateReadability} id="calReadability">
                Calculate Readability Score
              </button>
              <h3 style={{ color: props.mode === 'dark' ? 'white' : '#042743' }}>Readability Score: {readabilityScore}</h3>
            </div>
          </div>
    
    
        
    
      <div className="container my-3" style={{ color: props.mode === 'dark' ? 'white' : '#042743' }}>
        <h2>Your Text Summary </h2>
        <p>{text.split(/\s+/).filter((element) => { return element.length !== 0 }).length} words and {text.length} characters.</p>
        <h2>Preview</h2>
        <p>{text.length > 0 ? text : "Nothing to preview!"}</p>
      </div>
    </>
  );
}

export default Textform;
