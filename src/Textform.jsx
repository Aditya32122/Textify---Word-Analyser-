import React ,{ useState } from "react";

function Textform(props){
    
    const[text,setText] = useState('');

    const handleuppercase = () => {
        const newText = text.toUpperCase();
        setText(newText);
        props.showAlert('Converted to uppercase!', 'success');
      };
 
    const handlelowercase =() => {
        let lower= text.toLowerCase();
        setText(lower);
        props.showAlert("Converted to lowercase!", "success");
    };
    
    const handleOnChange = (event)=>{
        setText(event.target.value);
    }

    const handleclear = () => {
        let newtext = '';
        setText(newtext);
        props.showAlert("Text cleared","warning")
    }

    const handlecopy = () =>{
        navigator.clipboard.writeText(text); 
        props.showAlert("Copied to Clipboard!", "success");
    }

    const speak = () => {
        let msg = new SpeechSynthesisUtterance();
        msg.text = text;
        window.speechSynthesis.speak(msg);
      }
      const handleExtraSpaces = () => {
        let newText = text.split(/[ ]+/);
        setText(newText.join(" "));
        props.showAlert("Extra spaces removed!", "success");
    }
  
   
    return(
        <>
        <div className="container" style={{color: props.mode==='dark'?'white':'#042743'}}>
            <div className="mb-3">
                <h1>Enter the text below:</h1>
                <label htmlFor="textarealabel" className="label"></label>
                <textarea className="form-control" id="textarea" value={text} rows="8" onChange={handleOnChange} style={{backgroundColor:props.mode ==='dark' ? '#13466e':'white',color:props.mode==="dark"?"white" : '#042743'}}></textarea><br />
                <button id="touppercasebtn" onClick={handleuppercase}> Convert to Upper Case</button>
                <button id="touppercasebtn" onClick={handlelowercase}> Convert to Lower Case</button>
                <button id="clearbtn" onClick={handleclear}>Clear Text</button>
                <button id="copybtn" onClick={handlecopy}>Copy Text</button>
                <button id="speak" onClick={speak} >Speak</button>
                <button id="extraspaces" disabled={text.length===0} onClick={handleExtraSpaces}>Remove Extra Spaces</button>

</div>
        </div>
             <div className="container my-3" style={{color: props.mode==='dark'?'white':'#042743'}}>
                   <h2>Your Text Summary </h2>
                   <p> {text.split(" ").filter((element)=> {return element.length !==0;}).length} words  and {text.length} characters.</p>
                   <h2>Preview</h2>
                   <p>{text}</p>
                </div>
        </>
    );
}
export default Textform