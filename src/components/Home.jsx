import React, { useState } from "react";
import { FiSend } from "react-icons/fi";
import { URL } from "../constants/constants";
import Answers from "./Answers";
import { PiRobotFill } from "react-icons/pi";


function Home() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(JSON.parse(localStorage.getItem("history")))

  const payload = {
    contents: [
      {
        parts: [{ text: question }],
      },
    ],
  };

  const askQuestion = async () => {


    if (localStorage.getItem("history")) {
      let history = JSON.parse(localStorage.getItem("history"));
      history = [question, ...history];
      localStorage.setItem("history", JSON.stringify(history));
      setRecentHistory(history);
    } else {
      localStorage.setItem("history", JSON.stringify([question]));
      setRecentHistory([question]);
    }


    if (!question.trim()) return;

    try {
      let response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      let dataString = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      let items = dataString
        .split("* ")
        .map((item) => item.trim())
        .filter(Boolean);

      setResult((prev) => [
        ...prev,
        { type: "q", text: question },
        { type: "a", text: items },
      ]);
      setQuestion("");
    } catch (error) {
      console.error("API Error:", error);
      setResult((prev) => [
        ...prev,
        { type: "q", text: question },
        {
          type: "a",
          text: ["Sorry, something went wrong. Please try again."],
        },
      ]);
    }

  };
  console.log(recentHistory)
  return (
    <div className="flex h-screen bg-gradient-to-r from-zinc-800 to-zinc-900 text-white">

      <div className="hidden md:block w-64 bg-zinc-900 border-r border-zinc-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            ChatBot
          </h2>
          <span className="text-sm text-zinc-400"><PiRobotFill size={24}/></span>
        </div>


        <p className="text-sm text-white d font-semibold">Recent Search</p>
        {
          recentHistory && recentHistory.map((item, index) => (
            <li key={index}>{item}</li>
          ))
        }
      </div>


      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {result.length > 0 ? (
              result.map((item, index) => {
                if (item.type === "q") {
                  return (
                    <div
                      key={index}
                      className="flex justify-end"
                    >
                      <div className="bg-zinc-700 text-white p-3 rounded-2xl max-w-[75%] text-right shadow-lg">
                        <Answers ans={item.text} index={index} />
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      className="flex justify-start"
                    >
                      <div className="bg-zinc-900 text-zinc-200 p-3 rounded-2xl max-w-[75%] shadow-lg">
                        {item.text.map((ansItem, ansIndex) => (
                          <div
                            key={`${index}-${ansIndex}`}
                            className="mb-2 last:mb-0"
                          >
                            <Answers ans={ansItem} index={ansIndex} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
              })
            ) : (
              <p className="text-center mt-10 font-bold text-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Hello, how can I help you?
              </p>
            )}
          </div>
        </div>


        <div className="p-4 border-t border-zinc-700">
          <div className="max-w-3xl mx-auto flex items-center bg-zinc-800 rounded-3xl px-4 py-2">
            <input
              type="text"
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent text-white text-lg outline-none placeholder-zinc-400"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askQuestion()}
            />
            <button
              onClick={askQuestion}
              className="ml-3 bg-zinc-700 hover:bg-zinc-600 p-2 rounded-full transition"
            >
              <FiSend size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
