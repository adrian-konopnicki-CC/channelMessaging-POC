import { useEffect, useRef, useMemo } from "react";
import "./App.css";

function App() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { port1, port2 } = useMemo(() => new MessageChannel(), []);

  useEffect(() => {
    const iframeElement = iframeRef.current;

    // Listen for messages from the iframe
    port1.onmessage = (event) => {
      console.log("Port 1:", event.data);
      inputRef.current!.value = "";
    };

    const handleLoad = () => {
      // Send a message to the iframe and push the message channel port
      iframeElement!.contentWindow?.postMessage(
        "init",
        window.location.origin,
        [port2]
      );
    };

    if (iframeElement) {
      iframeElement.addEventListener("load", handleLoad);
    }

    return () => {
      if (iframeElement) {
        iframeElement.removeEventListener("load", handleLoad);
      }
    };
  }, [port1, port2]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRef.current) {
      port1.postMessage(inputRef.current.value);
    }
  };

  return (
    <div>
      <h1>Parent Window</h1>
      <iframe
        ref={iframeRef}
        src="/iframe.html"
        width="600"
        height="600"
        title="Child Frame"
      />
      <form onSubmit={onSubmit}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginTop: 20,
          }}
        >
          <label htmlFor="messageInput" style={{ alignSelf: "start" }}>
            Send a message
          </label>
          <input
            type="text"
            id="messageInput"
            placeholder="Enter a message"
            style={{ padding: 8 }}
            ref={inputRef}
          />
          <button style={{ background: "#9c5e0b" }}>Send Message</button>
        </div>
      </form>
    </div>
  );
}

export default App;
