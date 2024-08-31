import styles from "./ProductCard.module.css";
import defaultProductImage from "../../assets/product.png";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config/Constants";
import AuthContext from "../../contexts/AuthContext";

function ProductCard(props) {

    const navigate = useNavigate();
    const userAuth = useContext(AuthContext);

    const [productImage, setProductImage] = useState(null);

    function productCardClick() {
        navigate("/product/" + props.product.id)
    }

    function getProductStars() {
        const rating = Math.round(props.product.rating);
        return ("★".repeat(rating) + "☆".repeat(5 - rating));
    }

    useEffect(() => {
        axios.get(apiUrl + "/product/get-image?productId=" + props.product.id, {responseType: "blob"}).then(response => {
            const url = URL.createObjectURL(response.data);
            setProductImage(url);
        }).catch(err => {
            return;
            //console.log(err);
        })
    }, [props])

    async function handleDeleteProduct(reviewId) {
        const token = userAuth.token;
        if (token) {
            axios.delete(apiUrl + "/product/delete", { reviewId: reviewId }, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                })
                .catch(error => {
                    alert("Error deleting review");
                });
        } else {
            alert("Authentication token is missing. Please log in.");
        }
    }

    return (
        <div onClick={productCardClick} className={styles["product-card"]}>
            <div className={styles["product-card-image-container"]}>
                {(() => {
                    if(productImage != null){
                        return(<img className={styles["product-card-image"]} src={productImage}></img>)
                    } else return(<img className={styles["product-card-image-default"]} src={defaultProductImage}></img>);
                })()}
                
            </div>
            <div className={styles["product-name"]}>{props.product.name}</div>
            <div className={styles["product-price"]}>{props.product.price} $</div>
            <div className={styles["product-rating"]}>{getProductStars()}</div>
        </div>
    )
}

export default ProductCard;