import { useState } from "react";
import "./Content.css";
import Loading from "./types/Loading";
import Error from "./types/error";
import FITB from "./types/fitb";
import FITBAns from "./answers/FitbAns";
import MCQ from "./types/mcq";
import MCQAns from "./answers/McqAns";
import MTF from "./types/mtf";
import MTFAns from "./answers/MtfAns";
import TF from "./types/tf";
import TFAns from "./answers/TfAns";
import fetchDataAPI from "./utilities/Data";
import Default from "./types/Default";
import { passages } from "../data/passages";

const Content = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fetchedContent, setFetchedContent] = useState(null);

  let content = <Default />;

  if (fetchedContent && props.showing === "FITB") {
    if (props.answers) content = <FITBAns data={fetchedContent["FITB"]} />;
    else content = <FITB data={fetchedContent["FITB"]} />;
  }

  if (fetchedContent && props.showing === "MTF") {
    if (props.answers) content = <MTFAns data={fetchedContent["MTF"]} />;
    else content = <MTF data={fetchedContent["MTF"]} />;
  }

  if (fetchedContent && props.showing === "MCQ") {
    if (props.answers) content = <MCQAns data={fetchedContent["MCQ"]} />;
    else content = <MCQ data={fetchedContent["MCQ"]} />;
  }

  if (fetchedContent && props.showing === "TF") {
    if (props.answers) content = <TFAns data={fetchedContent["TF"]} />;
    else content = <TF data={fetchedContent["TF"]} />;
  }
  if (error && !isLoading) content = <Error />;
  if (isLoading) content = <Loading />;

  const fetchData = (event) => {
    setIsLoading(true);
    setError(false);
    const context = document.getElementById("context").value;
    fetchDataAPI(context, setError, setFetchedContent, setIsLoading);
  };

  const loadRandomContext = () => {
    if (isLoading) return;
    
    if (passages.length > 0) {
      // Pick a random passage
      const randomIndex = Math.floor(Math.random() * passages.length);
      const randomPassage = passages[randomIndex];
      
      // Set the textarea value
      document.getElementById("context").value = randomPassage;
    }
  };

  const clear = () => {
    if (isLoading) return;
    document.getElementById("context").value = "";
  };

  return (
    <div className="container-fluid columns">
      <div className="row">
        <div className="col-md-5 column1">
          <div className="mb-0" id="context-out">
            <label className="form-label">Enter Context:</label>
            <textarea
              className="form-control shadow-none"
              id="context"
              rows="17"></textarea>
          </div>
          <div className="container-fluid eval-buttons-cont">
            <button
              type="button"
              className="btn shadow-none navButtons m-0"
              onClick={fetchData}>
              Evaluate
            </button>
            <button
              type="button"
              className="btn shadow-none navButtons"
              onClick={loadRandomContext}>
              Random-Context
            </button>
            <button
              type="button"
              className="btn shadow-none navButtons"
              onClick={clear}>
              Clear
            </button>
          </div>
        </div>
        <div className="col-md-7 column2">{content}</div>
      </div>
    </div>
  );
};
export default Content;
