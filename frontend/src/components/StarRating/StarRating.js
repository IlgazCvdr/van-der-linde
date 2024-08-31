import { useState, useEffect } from "react";
import styles from "./StarRating.module.css";

//★☆

function StarRating({reviewRating, onRatingChange}){

    const [starCount, setStarCount] = useState(-1);
    const [locked, setLocked] = useState(false);

    useEffect(() => {
        setStarCount(reviewRating);
    }, [reviewRating])

    function hoverStar(number){
        if(locked) return;
        onRatingChange(number);
        setStarCount(number);
    }

    function clickStar(number){
        setStarCount(number);
        onRatingChange(number);
        setLocked(!locked);
    }

    function getStar(number){
        if(number <= starCount) return "★";
        return "☆";
    }

    return(
        <div>
            <div onClick={() => {clickStar(1)}} onMouseOver={() => {hoverStar(1)}} className={styles["star"]}>{getStar(1)}</div>
            <div onClick={() => {clickStar(2)}} onMouseOver={() => {hoverStar(2)}} className={styles["star"]}>{getStar(2)}</div>
            <div onClick={() => {clickStar(3)}} onMouseOver={() => {hoverStar(3)}} className={styles["star"]}>{getStar(3)}</div>
            <div onClick={() => {clickStar(4)}} onMouseOver={() => {hoverStar(4)}} className={styles["star"]}>{getStar(4)}</div>
            <div onClick={() => {clickStar(5)}} onMouseOver={() => {hoverStar(5)}} className={styles["star"]}>{getStar(5)}</div>
        </div>
    )
}

export default StarRating;