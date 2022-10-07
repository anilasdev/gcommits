import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Octokit } from "@octokit/core";
import moment from "moment";

function App() {
  const [commits, setCommits] = useState([]);

  const octokit = new Octokit({
    auth: "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",
  });

  useEffect(() => {
    fetchCommits();
  }, []);

  const fetchCommits = async () => {
    const { data } = await octokit.request("/repos/anilasdev/gcommits/commits");
    console.log(data);
    setCommits(data);
  };

  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="commits">
        {commits.map((commit) => (
          <div className="commit">
            <p>{commit.commit.message}</p>
            <span className="">
              {moment(commit.commit.committer.date).format("DD/MM/YYYY")} by{" "}
              {""}
              {commit.commit.committer.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
