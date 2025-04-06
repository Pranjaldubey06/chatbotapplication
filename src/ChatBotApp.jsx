import axios from "axios";
import React, { useState } from "react";

function ChatBotApp() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function generateAnswer() {
    setAnswer("Thinking... 🤔");

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyA68msWFFUXfSqmnnWNQcbUb4rWF3GvKbs",
        method: "post",
        data: {
          contents: [
            {
              parts: [{ text: question }],
            },
          ],
        },
      });

      setAnswer(
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No answer found."
      );
    } catch (error) {
      setAnswer(" Error fetching answer. Check console.");
      console.error(error);
    }

    setQuestion("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl max-w-xl w-full p-6 space-y-4">
        <h1 className="text-3xl font-bold text-center text-indigo-700">
          🤖 ChatBot
        </h1>

        <div className="bg-gray-100 rounded-xl p-4 min-h-[100px] text-gray-800">
          {answer || "Ask something to get started..."}
        </div>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here..."
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          rows={4}
        />

        <button
          onClick={generateAnswer}
          className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          ✨ Generate Answer
        </button>
      </div>
    </div>
  );
}

export default ChatBotApp;
