import React from 'react'
import './Results.css';

const Results = (results) => {
    return (

        <div className="pa4 black-80 measure center shadow-5 pa4 br3 ba b--black">
            <label htmlFor="output" className="f6 b db mb2">Results</label>
            <input className="results-box" readOnly type="text" value={(results.results.message)}/>
        </div>

    );
}

export default Results;