import { useEffect } from "react";
import "./ProgressBar.css";
const ProgressBar = (props) => {
  useEffect(() => {
    console.log(props);
  }, []);
  return (
    (props.props == "1" && (
      <ol className="progress">
        <li className="is-active" data-step="1">
          Selectati bonul
        </li>
        <li data-step="2">Selectati produsele</li>
        <li data-step="3">Revizuiti</li>
        <li data-step="4" className="progress__last">
          Primiti raportul zilnic
        </li>
      </ol>
    )) ||
    (props.props == "2" && (
      <ol className="progress">
        <li data-step="1">Selectati bonul</li>
        <li className="is-active" data-step="2">
          Selectati produsele
        </li>
        <li data-step="3">Revizuiti</li>
        <li data-step="4" className="progress__last">
          Primiti raportul zilnic
        </li>
      </ol>
    )) ||
    (props.props == "3" && "trytry" && (
      <ol className="progress">
        <li data-step="1">Selectati bonul</li>
        <li data-step="2">Selectati produsele</li>
        <li data-step="3" className="is-active">
          Revizuiti
        </li>
        <li data-step="4" className="progress__last">
          Primiti raportul zilnic
        </li>
      </ol>
    )) ||
    (props.props == "4" && (
      <ol className="progress">
        <li data-step="1">Selectati bonul</li>
        <li data-step="2">Selectati produsele</li>
        <li data-step="3">Revizuiti</li>
        <li data-step="4" className="is-active progress__last">
          Primiti raportul zilnic
        </li>
      </ol>
    ))
  );
};
export default ProgressBar;
