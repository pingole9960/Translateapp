import React, { useState, useEffect, useCallback } from "react";
import countries from "../data";
import dialects from './dialects';

const Translate = () => {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("es");
  const [isTranslating, setIsTranslating] = useState(false);
  const [useDialect, setUseDialect] = useState(false);  // New state to toggle between dialect and API

  // API Call function
  const translateText = useCallback(async () => {
    if (!fromText.trim()) return;

    setIsTranslating(true);

    // If using dialect translation, skip the API call and do the dialect translation
    if (useDialect) {
      const match = dialects.find((entry) =>
        entry.standard.toLowerCase() === fromText.toLowerCase()
      );
      if (match) {
        setToText(match[toLang]);  // Use the dialect translation
      } else {
        setToText("No dialect translation found.");
      }
      setIsTranslating(false);
      return;
    }

    // API Call for regular translation
    const url = "https://free-google-translator.p.rapidapi.com/external-api/free-google-translator";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-key": "36fa353e11msh22ecf65ce15789ap125205jsnf5b51600de65", // Your API key
        "x-rapidapi-host": "free-google-translator.p.rapidapi.com",
      },
      body: JSON.stringify({
        from: fromLang,
        to: toLang,
        query: fromText,
      }),
    };

    try {
      const response = await fetch(url, options);
      
      // Handle cases where response is not JSON
      const textData = await response.text();
      console.log("Raw API Response:", textData);

      const data = JSON.parse(textData); // Parse JSON response
      console.log("Parsed API Response:", data);

      // Ensure correct key is used from response
      if (data && data.translation) {
        setToText(data.translation); // Correct key from API response
      } else {
        setToText("Translation error: Invalid API response");
      }
    } catch (error) {
      console.error("Translation error:", error);
      setToText("Error in translation");
    } finally {
      setIsTranslating(false);
    }
  }, [fromText, fromLang, toLang, useDialect]);

  // Auto-call translation when text changes
  useEffect(() => {
    const delay = setTimeout(() => {
      if (fromText) translateText();
    }, 1000);

    return () => clearTimeout(delay);
  }, [fromText, fromLang, toLang, useDialect, translateText]);

  return (
    <div className="container">
      <div className="wrapper">
        <div className="text-input">
          <textarea
            placeholder="Enter text"
            value={fromText}
            onChange={(e) => setFromText(e.target.value)}
          />
          <textarea placeholder="Translated text" value={toText} readOnly />
        </div>
        <div className="row">
          <select value={fromLang} onChange={(e) => setFromLang(e.target.value)}>
            {Object.keys(countries).map((code) => (
              <option key={code} value={code}>
                {countries[code]}
              </option>
            ))}
          </select>
          <button onClick={translateText} disabled={isTranslating}>
            {isTranslating ? "Translating..." : "Translate"}
          </button>
          <select value={toLang} onChange={(e) => setToLang(e.target.value)}>
            {Object.keys(countries).map((code) => (
              <option key={code} value={code}>
                {countries[code]}
              </option>
            ))}
          </select>
        </div>

        {/* Toggle for Dialect or Standard translation */}
        <div className="dialect-toggle">
          <label>
            <input
              type="checkbox"
              checked={useDialect}
              onChange={() => setUseDialect((prev) => !prev)}
            />
            Use Dialect Translation
          </label>
        </div>
      </div>
    </div>
  );
};

export default Translate;
