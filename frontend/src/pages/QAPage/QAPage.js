import axios from "axios";
import QuestionList from "../../components/QuestionList/QuestionList";
import { apiUrl } from "../../config/Constants";
import styles from "./QAPage.module.css";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

function QAPage() {

    const [questions, setQuestions] = useState(null);

    const navigate = useNavigate();

    const authValues = useContext(AuthContext);

    useEffect(() => {
        axios.get(apiUrl + "/community/Q&A/get-questions").then(response => {
            setQuestions(response.data);
        }).catch(err => {
            console.log(err);
        })
    }, []);

    return (
        <div className="w-75 d-flex flex-column align-items-center">
            <h1>Questions</h1>
            {(() => {
                if (!authValues.user) return;
                if (!authValues.token) return;
                return (
                    <div className={"d-grid gap-2 " + styles["create-button-container"]}>
                        <Button onClick={() => { navigate("/qa/create-question") }} variant="primary" size="lg">
                            Create Question
                        </Button>
                    </div>
                )
            })()}

            <QuestionList questions={questions}></QuestionList>
        </div>
    )
}

export default QAPage;