import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Octokit } from "@octokit/core";
import moment from "moment";
import Countdown from "react-countdown";

function App() {
  const [commits, setCommits] = useState([]);
  const [isTokenFound, setIsTokenFound] = useState(null);
  const [octokitConfig, setOctokitConfig] = useState(null);
  const [isFetching, setIsfetching] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [countdown, setCountdown] = useState(Date.now());
  useEffect(() => {
    let isFound = localStorage.getItem("access_token");
    if (isFound) {
      setIsTokenFound(true);
      const octokit = new Octokit({
        auth: isFound,
      });
      // setAccessToken(isFound);
      setOctokitConfig(octokit);
    } else {
      setIsTokenFound(false);
    }
  }, []);

  useEffect(() => {
    if (isTokenFound) fetchCommits();
  }, [isTokenFound]);

  const fetchCommits = async () => {
    const { data } = await octokitConfig.request(
      "/repos/anilasdev/gcommits/commits"
    );
    console.log(data);
    setCommits(data);
    setTimeout(() => {
      setIsfetching(false);
      setNow(Date.now());
      setCountdown(Date.now());
    }, 1000);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let body = {};
    formData.forEach((value, key) => {
      body[key] = value;
    });
    console.log(body);
    localStorage.setItem("access_token", body.access_token);
    window.location.reload();
  };
  const onRefresh = () => {
    setIsfetching(true);
    fetchCommits();
  };
  console.log(isTokenFound, "isTokenFound");
  return (
    <div className="App">
      <header className="App-header">Github Commits</header>
      {!isTokenFound && (
        <form onSubmit={onSubmit}>
          <input
            placeholder="Please provide your personal access token"
            required
            name="access_token"
          ></input>
          <button className="" type="submit">
            Submit
          </button>
        </form>
      )}
      {isTokenFound && (
        <>
          <div className="reload">
            <div
              class={`reloadSingle ${isFetching ? "spin" : ""}`}
              onClick={onRefresh}
              style={{ transform: [{ rotate: "360deg" }] }}
            ></div>
            <Countdown
              date={now + 30000}
              key={countdown}
              onComplete={onRefresh}
              renderer={({ hours, minutes, seconds, completed }) => {
                // Render a countdown
                return <span>{seconds}</span>;
              }}
            />
          </div>
          <div className="commits">
            {commits.map((commit) => (
              <div className="commit">
                <p className="commit-title">{commit.commit.message}</p>
                <span className="commit-by">
                  {moment(commit.commit.committer.date).format("DD/MM/YYYY")} by{" "}
                  {""}
                  {commit.commit.committer.name}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
