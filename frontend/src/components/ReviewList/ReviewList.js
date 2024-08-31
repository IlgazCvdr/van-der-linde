import ReviewCard from "../ReviewCard/ReviewCard";
import styles from "./ReviewList.module.css";

function ReviewList({ reviews, currentUser, handleDeleteReview, handleEditReview, productId }) {

    return (
        <div className={styles["review-list"]}>
            <h2 className={styles["list-title"]}>Product Reviews</h2>
            {reviews && reviews.map(review => (
                <ReviewCard productId={productId} handleDeleteReview={handleDeleteReview} handleEditReview ={handleEditReview} review={review}></ReviewCard>
            ))}
        </div>
    );
}

export default ReviewList;