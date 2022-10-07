import { useEffect } from "react";
import "./App.css";
import { Octokit } from "@octokit/core";

function App() {
  const octokit = new Octokit({
    auth: "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",
  });

  useEffect(() => {
    fetchCommits();
  }, []);

  const fetchCommits = async () => {
    const { data } = await octokit.request("/repos/anilasdev/gcommits/commits");
    console.log(data);
  };

  return (
    <div className="App">
      <header className="App-header">
      </header>
    </div>
  );
}

export default App;
