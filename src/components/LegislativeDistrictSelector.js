import React from 'react'
import { css } from "@emotion/react";

import {
    getDistrictNumber,
    getCorrespondingSenateDistrictNumber,
} from '../lib/utils'

const districtSelectorStyle = css`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    select {
        appearance: none;
        outline: none;
        cursor: pointer;
        color: var(--link);
        background-color: #fff;
        border: 1px solid var(--tan5);
        border-radius: 3px;
        height: 60px;
        font-size: 1em;
        /* font-weight: bold; */
        padding: 10px 5px;
        margin: 0 0.2em;
        box-shadow: 2px 2px 3px #aaa;
        text-align: center;
    }
    select:focus {
        outline: 2px solid var(--highlight);
    }
    

    button {
        height: 60px;
        width: 40px;
        border: 1px solid var(--tan5);
        border-radius: 3px;
        background-color: #fff;
        color: #aaa;
        box-shadow: 2px 2px 3px #aaa;
    }
    button.disabled {
        opacity: 0.6;
    }
    button:hover {
        background-color: #eee;
        color: var(--link);
    }
    
`


export default function LegislativeDistrictSelector(props) {
    const {
        houseDistrictOptions,
        setLegislativeDistricts, // passes resuls to parent component
        selHd,
    } = props

    // const [hdValue, setHdValue] = React.useState(houseDistrictOptions[0])
    // const [sdValue, setSdValue] = React.useState(senateDistrictOptions[0])

    function handleDistrictSelect(event) {
        return selectDistrict(event.target.value)
    }

    function stepDown() {
        let number = getDistrictNumber(selHd) - 1
        if (number === 0) number = 100
        selectDistrict(`HD-${number}`)
    }

    function stepUp() {
        let number = getDistrictNumber(selHd) + 1
        if (number === 101) number = 1
        selectDistrict(`HD-${number}`)
    }

    function selectDistrict(houseDistrict) {
        // logic so updating House District pulls up corresponding Senate District concurrently
        const correspondingSenateDistrict = `SD-${getCorrespondingSenateDistrictNumber(houseDistrict)}`
        setLegislativeDistricts(houseDistrict, correspondingSenateDistrict)
    }

    return <div css={districtSelectorStyle}>
        <button onClick={stepDown}>{'<'}</button>
        <select onChange={handleDistrictSelect} value={selHd}>
            {houseDistrictOptions.map(d => <option key={d} value={d}>
                House District {d.replace('HD-', '')} / Senate District {getCorrespondingSenateDistrictNumber(d)}
            </option>)}
        </select>
        <button onClick={stepUp}>{'>'}</button>

    </div>
}