import { useState } from 'react';
import './App.css';

import Checkbox from './components/Checkbox';

function App() {

  const savePasswordToBackend = (password, userInformation) => {
    fetch('http://localhost:3001/save-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, userInformation }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Error saving password:', error);
      });
  };

  const [passwordGen, setPasswordGen] = useState({
    length: 5,
    quantity: 5,
    uppercase: false,
    lowercase: true,
    numbers: false,
    symbols: false,
  });
  const [passwords, setPasswords] = useState([]);
  const [copied, setCopied] = useState(Array(5).fill(false));

  const handleChangeUppercase = () => {
    setPasswordGen({
      ...passwordGen,
      uppercase: !passwordGen.uppercase,
    });
  };

  const setPasswordQuantity = (val) => {
    setPasswordGen({
      ...passwordGen,
      quantity: val,
    });
  };

  const handleChangeNumbers = () => {
    setPasswordGen({
      ...passwordGen,
      numbers: !passwordGen.numbers,
    });
  };

  const handleChangeSymbols = () => {
    setPasswordGen({
      ...passwordGen,
      symbols: !passwordGen.symbols,
    });
  };

  const setPasswordLength = (val) => {
    setPasswordGen({
      ...passwordGen,
      length: val,
    });
  };

  function generatePassword() {
    const numbersArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const symbolsArray = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];

    const characterCodes = Array.from(Array(26)).map((_e, i) => i + 97);
    const lowerCaseLetters = characterCodes.map((code) =>
      String.fromCharCode(code)
    );
    const upperCaseLetters = lowerCaseLetters.map((letter) =>
      letter.toUpperCase()
    );

    const { length, uppercase, lowercase, numbers, symbols } = passwordGen;

    const generateTheWord = (
      length,
      uppercase,
      lowercase,
      numbers,
      symbols
    ) => {
      const availableCharacters = [
        ...(lowercase ? lowerCaseLetters : []),
        ...(uppercase ? upperCaseLetters : []),
        ...(numbers ? numbersArray : []),
        ...(symbols ? symbolsArray : []),
      ];
      const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
      const characters = shuffleArray(availableCharacters).slice(0, length);
      return characters.join('');
    };

    const newPasswords = Array.from({ length: passwordGen.quantity }, () => {
      return generateTheWord(length, uppercase, lowercase, numbers, symbols);
    });

    setPasswords(newPasswords);
    setCopied(Array(passwordGen.quantity).fill(false));
  }

  return (
    <div className="wrapper">
      <div className="container wrapper-box">
        <h2>Password Generator</h2>
        <div className="word-crieteria__box">
          <div>
            <label>length</label>
          </div>
          <div>
            <input
              type="number"
              min="4"
              max="20"
              value={passwordGen.length}
              onChange={(e) => setPasswordLength(e.target.value)}
            />
          </div>
        </div>
        <div className="word-crieteria__box">
          <div>
            <label>quantity</label>
          </div>
          <div>
            <input
              type="number"
              min="4"
              max="20"
              value={passwordGen.quantity}
              onChange={(e) => setPasswordQuantity(e.target.value)}
            />
          </div>
        </div>
        <div className="word-crieteria__box">
          <div>
            <label>uppercase</label>
          </div>
          <div>
            <Checkbox
              value={passwordGen.uppercase}
              onChange={handleChangeUppercase}
            />
          </div>
        </div>
        <div className="word-crieteria__box">
          <div>
            <label>numbers</label>
          </div>
          <div>
            <Checkbox
              value={passwordGen.numbers}
              onChange={handleChangeNumbers}
            />
          </div>
        </div>
        <div className="word-crieteria__box">
          <div>
            <label>symbols</label>
          </div>
          <div>
            <Checkbox
              value={passwordGen.symbols}
              onChange={handleChangeSymbols}
            />
          </div>
        </div>
        <div>
          <button className="generate-button" onClick={generatePassword}>
            Generate password
          </button>
        </div>
        <br />
        {passwords.map((password, index) => (
          <div key={index} className="password-box">
            <p>{password}</p>
<button
  className={`copy-button ${copied[index] ? 'copied' : ''}`}
  onClick={() => {
    navigator.clipboard.writeText(password);
    savePasswordToBackend(password, {
      ipAddress: 'some ip :D (idk how safe to get an IP) ', 
      userAgent: navigator.userAgent,
    });
    setCopied((prevCopied) => {
      const newCopied = [...prevCopied];
      newCopied[index] = true;
      return newCopied;
    });
  }}
>
  {copied[index] ? 'Copied!' : 'Copy text'}
</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;