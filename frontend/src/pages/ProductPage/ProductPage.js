import { useContext, useEffect, useState } from "react";
import styles from "./ProductPage.module.css"
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config/Constants";
import defaultProductImage from "../../assets/product.png";
import ProductList from "../../components/ProductList/ProductList";
import ReviewList from "../../components/ReviewList/ReviewList";
import AuthContext from "../../contexts/AuthContext";
import { Button, Form, Modal } from "react-bootstrap";
import StarRating from "../../components/StarRating/StarRating";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import ModalContext from "../../contexts/ModalContext";

function ProductPage(props) {
    let { productId } = useParams();

    const [product, setProduct] = useState();
    const [productImage, setProductImage] = useState();
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(0);
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState(null);

    const userAuth = useContext(AuthContext);
    const modalValues = useContext(ModalContext);
    let navigate = useNavigate();

    function handleFileChange(event) {
        setImage(event.target.files[0]);
    }

    function ratingChange(newRating) {
        setReviewRating(newRating);
    }

    function getProductStars() {
        const rating = Math.round(product.rating);
        return ("★".repeat(rating) + "☆".repeat(5 - rating));
    }

    useEffect(() => {
        axios.get(apiUrl + "/product/get?productId=" + productId)
            .then(response => {
                setProduct(response.data);
                // Fetch category here
                axios.get(apiUrl + "/product/get-categories?productId=" + productId)
                    .then(categoryResponse => {
                        setCategory(categoryResponse.data);
                    })
                    .catch(error => {
                        console.error("Error fetching category:", error);
                    });
            })
            .catch(error => {
                console.error("Error fetching product:", error);
            });

        axios.get(apiUrl + "/product/get-reviews?productId=" + productId)
            .then(response => {
                setReviews(response.data);
            })
            .catch(error => {
                console.error("Error fetching reviews:", error);
            });

        axios.get(apiUrl + "/product/get-image?productId=" + productId, { responseType: "blob" })
            .then(response => {
                const url = URL.createObjectURL(response.data);
                setProductImage(url);
            })
            .catch(error => {
                console.error("Error fetching product image:", error);
            });
    }, []);


    function merchantClick() {
        navigate("/user/" + product.merchant.id);
    }

    function editProductClick() {
        navigate(`/edit/${productId}`);
    }

    async function deleteProductClick(productId) {
        const token = userAuth.token;
        if (token) {
            try {
                await axios.post(apiUrl + "/product/delete", { "productId": productId }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                alert("Product deleted successfully.");
                navigate("/");
            } catch (error) {
                console.error("Error deleting product:", error);
                modalValues.showError("Failed to delete product. Please try again later.");
            }
        } else {
            alert("Authentication token is missing. Please log in.");
        }
    }

    async function handleAddReview() {
        if (reviewText.trim() === '') {
            modalValues.showError("You must enter a review text.");
            return;
        }

        if (reviewRating === 0) {
            modalValues.showError("You must select a rating.");
            return;
        }

        const token = userAuth.token;

        const formData = new FormData();

        formData.set("text", reviewText);
        formData.set("rating", reviewRating);
        formData.set("productId", productId);
        formData.set("image", image)

        if (token) {
            try {
                await axios.post(apiUrl + "/review/create", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    }
                });

                setReviewText("");
                setReviewRating(0);

                const reviewResponse = await axios.get(apiUrl + "/product/get-reviews?productId=" + productId, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setReviews(reviewResponse.data);
            } catch (error) {
                console.error("Error adding review:", error);
                console.log("Error response:", error.response);
                alert("Failed to add review. Please try again later.");
            }
        } else {
            alert("Authentication token is missing. Please log in.");
        }
    }

    async function handleDeleteReview(reviewId) {
        const token = userAuth.token;
        if (token) {
            try {
                await axios.post(apiUrl + "/review/delete", { reviewId: reviewId }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const reviewResponse = await axios.get(apiUrl + "/product/get-reviews?productId=" + productId, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setReviews(reviewResponse.data);
            } catch (error) {
                console.error("Error deleting review:", error);
            }
        } else {
            alert("Authentication token is missing. Please log in.");
        }
    }

    // Function to handle editing a review
    async function handleEditReview(reviewId) {
        navigate(`/edit/${reviewId}`);

    }

    return (
        <div className={styles["product-page"]}>
            <div className={styles["product-container"]}>
                <div className={styles["product-image-container"]}>
                    {productImage != null ? (
                        <img src={productImage} className={styles["product-image"]} alt="Product" />
                    ) : (
                        <img src={defaultProductImage} className={styles["product-image-default"]} alt="Product" />
                    )}
                </div>
                {product && (
                    <div className={styles["product-info-container"]}>
                        <div className={styles["product-name"]}>{product.name}</div>
                        <div className={styles["product-price"]}>{product.price} $</div>
                        <div className={styles["product-rating"]}>{getProductStars() + " " + product.rating}</div>
                        <div><div className="d-inline">Sold by: </div><div onClick={merchantClick} className={styles["product-merchant"]}>{product.merchant.firstName + " " + product.merchant.lastName}</div></div>
                        <div className={styles["product-category"]}>Categories:
                            {category && category.length > 0 ? (
                                <span className={styles["category"]}>{category.map((cat, index) => (
                                    <span key={cat.id}>
                                        {index > 0 && ", "} {cat.name}
                                    </span>
                                ))}</span>
                            ) : (
                                <span className={styles["category"]}>No category</span>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className={styles["submit-button-container"]}>


                {(() => {
                    if(!userAuth.user) return;
                    if (userAuth.user.roleNames.includes("admin") || product && userAuth.user && userAuth.user.id === product?.merchant?.id) {
                        return (
                            <div className={styles["info"]}>
                                <div className="mt-3 d-flex justify-content-between">
                                    <Button onClick={editProductClick} variant="primary"> Edit Product</Button>
                                    <div style={{ marginLeft: '10px' }}>
                                        <Button variant="danger" onClick={() => deleteProductClick(productId)}> Delete Product</Button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })()}
            </div>
            <div className={styles["review-input-container"]}>
                <div className={styles["rating-container"]}>
                    <StarRating reviewRating={reviewRating} onRatingChange={ratingChange}></StarRating>
                </div>
                <div className={styles["review-text-input-container"]}>
                    <Form.Control id="review-text-area" as="textarea" rows={3} placeholder="Enter your review" className={styles["review-text-input"]} value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
                </div>
                <Form.Control className="mt-1" type="file" onChange={handleFileChange} />
                <div className={styles["submit-button-container"]}>
                    <Button variant="primary" onClick={handleAddReview}>Add Review</Button>
                </div>
            </div>
            <ReviewList productId={productId} reviews={reviews} currentUser={userAuth.user} handleDeleteReview={handleDeleteReview} handleEditReview={handleEditReview} />
        </div>
    )



}

export default ProductPage;
