import { useNavigate } from "react-router-dom";
import styles from "./QuestionList.module.css";

function QuestionList({questions}){

    const navigate = useNavigate();

    return(
        <div className={styles["question-list"]}>
            {(() => {
                if(!questions) return(<h2>No questions found.</h2>);
                if(questions.length == 0) return(<h2>No questions found.</h2>);
                return questions.map(q => {
                    return(
                        <div onClick={() => {navigate("/qa/question/" + + q.questionPostId)}} className={styles["question-card"]}>
                            <div className={styles["question-title"]}>{q.title}</div>
                            <div className={styles["question-author"]}>{q.author.firstName + " " + q.author.lastName}</div>
                        </div>
                    )
                })
            })()}
        </div>
    )
}

export default QuestionList;