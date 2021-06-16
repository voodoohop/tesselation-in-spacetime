import React, { useReducer, useState } from "react";
import ReactDOM from "react-dom";

import { useInterval } from "react-use";
import { useCelularAutomata } from "./useCelularAutomata";
import { Cubes } from "./Cubes2";
import {useSearchParam} from 'react-use';

const startTime = 1623859266065;
const changeEvery = 30; // in seconds

const size = [7,7,7];

const seed="mjhjhjhjhj";

const App = () => {
    const [reachedIteration, setReachedIteration] = useState(false);
    const [timeToNext, setTimeToNext] = useState("---");
    const [desiredIteration, setDesiredIteration] = useState(0);

    const [rule, setRule] = useState("5678/6789");

    

    const {cell, iterate, iteration} = useCelularAutomata({size, rule, seed});

    const enableWarmup = useSearchParam("nowarmup")  === null;
    

    useInterval(() => {
        const timeDifference = (new Date().getTime() - startTime) / 1000;
        const desiredIteration = Math.floor(timeDifference / changeEvery);
        setDesiredIteration(_ => desiredIteration);
        
        // console.log(desiredIteration);
        if (iteration() < desiredIteration && enableWarmup) {
            const stepSize = Math.ceil((desiredIteration - iteration())/3);
            iterate(stepSize);
        } else {
            setTimeToNext(Math.floor((changeEvery - timeDifference % changeEvery)));
            setReachedIteration(_ => true);
        }
    }, 1000)


    return (
    <>
        <div className="legend"><span className="label">Rule&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> {rule}</div>
        <div className="legend"><span className="label">Iteration</span> {iteration()}</div>
        <div className="right legend"> <span className="label">Next(sec)</span> {timeToNext}</div>

            <div id="plane-wrapper">
            <div className="spacer"></div>
            <div id="plane">
                <Cubes {...{cell, reachedIteration, size, timeToNext}} />
            </div>
        </div>
    </>);
}

const container = document.getElementById("react_root");
ReactDOM.render(<App />, container);
