import styles from "./EditReview.module.css";
import { Form, Button } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import StarRating from "../../components/StarRating/StarRating";
import axios from "axios";
import { apiUrl } from "../../config/Constants";
import AuthContext from "../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import ModalContext from "../../contexts/ModalContext";

function EditReviewPage(props) {

    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(0);
    const [image, setImage] = useState(null);
    const [product, setProduct] = useState(null);
    let { reviewId } = useParams();

    const authValues = useContext(AuthContext);

    const navigate = useNavigate();

    function handleSubmit(event){
        event.preventDefault();
        
        const formData = new FormData();

        formData.set("reviewId", parseInt(reviewId));
        formData.set("text", reviewText);
        formData.set("rating", reviewRating);
        formData.set("image", image);

        axios.post(apiUrl + "/review/update", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${authValues.token}`
            }
        }).then(response => {
            navigate("/product/" + product.id);
        }).catch(err => {
            alert("Couldn't update review");
        })
    }

    function onRatingChange(number){
        setReviewRating(number);
    }

    function onFileChange(event){
        setImage(event.target.files[0]);
    }

    useEffect(() => {
        axios.get(apiUrl + "/review/get?reviewId=" + reviewId).then(response => {
            const review = response.data;
            setReviewRating(review.rating);
            setReviewText(review.text);
        })

        axios.get(apiUrl + "/product/get-by-reviewId?reviewId=" + reviewId).then(response => {
            setProduct(response.data);
        })
    }, [])

    return (
        <div className={styles["form-container"]}>
            <h1>Edit Review</h1>
            <Form className="border p-3 w-75" onSubmit={handleSubmit}>
                <StarRating onRatingChange={onRatingChange} reviewRating={reviewRating}></StarRating>
                <Form.Group controlId="reviewText">
                    <Form.Control id="review-text-area" as="textarea" rows={3} placeholder="Enter your review" className={styles["review-text-input"]} value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
                </Form.Group>
                <Form.Control className="mt-1" type="file"  onChange={onFileChange}/>
                <Button className="mt-2" variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default EditReviewPage;