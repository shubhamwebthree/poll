import React, { useState, useEffect } from "react";
import { poll_backend } from "../../declarations/poll_backend";

const App = () => {
  const [question, setQuestion] = useState("Choose");
  const [pollResults, setPollResults] = useState({
    Rahul_Gandhi: 0,
    Nitin_Gadkari: 0,
    Arvind_Kejariwal: 0,
  });
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const questionFromBackend = await poll_backend.getQuestion();
        setQuestion(questionFromBackend);

        const voteCounts = await poll_backend.getVotes();
        updateLocalVoteCounts(voteCounts);
        console.log(voteCounts);
      } catch (error) {
        console.error("Error fetching poll data:", error);
      }
    };

    fetchPollData();
  }, []);

  const updateLocalVoteCounts = (voteCountsArray) => {
    const updatedResults = { ...pollResults };
    voteCountsArray.forEach(([option, count]) => {
      updatedResults[option] = parseInt(count, 10);
    });
    setPollResults(updatedResults);
  };

  const handleVoteSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOption) return;

    try {
      const updatedVoteCounts = await poll_backend.vote(selectedOption);
      updateLocalVoteCounts(updatedVoteCounts);
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  const handleReset = async () => {
    try {
      await poll_backend.resetVotes();
      const resetVoteCounts = await poll_backend.getVotes();
      updateLocalVoteCounts(resetVoteCounts);
    } catch (error) {
      console.error("Error resetting votes:", error);
    }
  };

  return (
      <div className="title-container">
      <h4>{question}</h4>
      <div className="form-container">
        <br />
        <form onSubmit={handleVoteSubmit}>
          {Object.keys(pollResults).map((option) => (
            <div key={option}>
              <label>
                <input
                  type="radio"
                  name="option"
                  value={option}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />{" "}
                {option}
              </label>
            </div>
          ))}
          <button type="submit">Vote</button>
        </form>
      </div>

      <h4>Results</h4>
      <div id="results">
        <ul>
          {Object.entries(pollResults).map(([option, count]) => (
            <li key={option}>
              <strong>{option}</strong>: {count}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default App;
