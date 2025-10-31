import "./App.css";
import { useRef, useState } from "react";

import { useAskQuestion } from "./hooks/useAskQuestion";
import Message from "./components/Message";
import Loading from "./components/Loading";

function App() {
  const inputRef = useRef();
  const [messages, setMessages] = useState([]);
  const { askQuestion, loading, error } = useAskQuestion();

  function addMessage(role, content) {
    setMessages((prev) => [...prev, { role, content }]);
  }

  async function sendAnswer(event) {
    event.preventDefault();

    if (event.type === "click" || event.key === "Enter") {
      const question = inputRef.current.value;
      inputRef.current.value = "";

      addMessage("user", question);
      const answer = await askQuestion(question);
      addMessage("assistant", answer);
    }
  }

  const messageComponents = messages.map((message, index) => (
    <Message content={message.content} role={message.role} key={index} />
  ));

  return (
    <main className="chat">
      <header className="chat__header">
        <h1>TechNova Supportbot</h1>
        <p>Din digitala kundtjänstassistent 💬</p>
      </header>

      <section className="chat__messages">
        {messageComponents}
        {loading && <Loading />}
        {error && <p className="chat__error">{error.message || error.toString()}</p>}
      </section>

      <form className="chat__form">
        <input
          type="text"
          ref={inputRef}
          placeholder="Skriv din fråga här..."
          className="chat__input"
        />
        <button onClick={sendAnswer} onKeyUp={sendAnswer} className="chat__button">
          Skicka
        </button>
      </form>

      <footer className="chat__footer">
        © 2025 TechNova AB – Alla rättigheter förbehållna.
      </footer>
    </main>
  );
}

export default App;
