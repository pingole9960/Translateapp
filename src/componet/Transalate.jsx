import React, { useState, useEffect, useCallback } from "react";
import countries from "../data";

const Translate = () => {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("es");
  const [isTranslating, setIsTranslating] = useState(false);

  // API Call function
  const translateText = useCallback(async () => {
    if (!fromText.trim()) return;

    setIsTranslating(true);

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
  }, [fromText, fromLang, toLang]);

  // Auto-call translation when text changes
  useEffect(() => {
    const delay = setTimeout(() => {
      if (fromText) translateText();
    }, 1000);

    return () => clearTimeout(delay);
  }, [fromText, fromLang, toLang, translateText]);

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
      </div>
    </div>
  );
};

export default Translate;
