import { useContext, useEffect, useState } from "react";
import AuthContext from "../../contexts/AuthContext";
import styles from "./ReviewCard.module.css";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";
import { apiUrl } from "../../config/Constants";

function ReviewCard(props) {
    const [image, setImage] = useState(null);
    const authValues = useContext(AuthContext);
    let navigate = useNavigate();

    function onUserClick() {
        navigate("/user/" + props.review.user.id);
    }

    function getStars() {
        return ("★".repeat(props.review.rating) + "☆".repeat(5 - props.review.rating));
    }
	
    function handleEditReview() {
        navigate("/edit-review/" + props.review.id);
    }

    useEffect(() => {
        axios.get(apiUrl + "/review/get-image?reviewId=" + props.review.id, { responseType: "blob" }).then(response => {
            const url = URL.createObjectURL(response.data);
            setImage(url);
        }).catch(err => {
            console.log(err);
        })
    }, []);

    return (
        <div className={styles["review-card"]}>
            {(() => {
                if (!props.review) return;
                return (
                    <div>
                        <div onClick={onUserClick} className={styles["user-name"]}>{props.review.user.firstName + " " + props.review.user.lastName + ":"}</div>
                        <div className={styles["rating"]}>{getStars()}</div>
                        <div className={styles["text"]}>{props.review.text}</div>
                        {(() => {
                            if (image != null) {
                                return (
                                    <div className={styles["review-image-container"]}>
                                        <img className={styles["review-image"]} src={image}></img>
                                    </div>
                                )
                            }
                        })()}
                        {(() => {
                            if (!authValues.user) return;
                            if (authValues.user.id == props.review.user.id || authValues.user.roleNames.includes("admin") || authValues.user.roleNames.includes("admın")) {
                                return (
                                    <div className="d-flex gap-1">
                                        <Button onClick={() => props.handleDeleteReview(props.review.id)} variant="danger" className="mt-2" size="sm">
                                            Delete
                                        </Button>
                                        <Button onClick={handleEditReview} variant="primary" className="mt-2" size="sm">
                                            Edit
                                        </Button>
                                    </div>
                                );
                            }
                        })()}
                    </div>
                )
            })()}

        </div>
    );
}

export default ReviewCard;
