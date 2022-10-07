import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Octokit } from "@octokit/core";
import moment from "moment";

function App() {
  const [commits, setCommits] = useState([]);
  const [isTokenFound, setIsTokenFound] = useState(null);
  // const [accessToken, setAccessToken] = useState(null);
  const [octokitConfig, setOctokitConfig] = useState(null);
  const [isFetching, setIsfetching] = useState(false);

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
    setTimeout(() => setIsfetching(false), 1000);
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
      {/* <header className="App-header"></header> */}
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
          <div
            class={`reloadSingle ${isFetching ? "spin" : ""}`}
            onClick={onRefresh}
            style={{ transform: [{ rotate: "360deg" }] }}
          ></div>
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
        </>
      )}
    </div>
  );
}

export default App;
