import styles from "./EditProduct.module.css";
import { Form, Button } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../config/Constants";
import AuthContext from "../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import ModalContext from "../../contexts/ModalContext";

function EditProductPage() {

    const auth = useContext(AuthContext);
    const modalValues = useContext(ModalContext)
    const navigate = useNavigate();
    const { productId } = useParams();
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchProductDetails();
    }, []);

    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(apiUrl + `/product/get?productId=${productId}`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            const productData = response.data;
            setTitle(productData.name);
            setPrice(productData.price);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };

    function handleFileChange(event){
        setImage(event.target.files[0]);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();

        formData.set("name", title);
        formData.set("price", price);
        formData.set("image", image);
        formData.set("productId", productId); 
        
        if (auth.token) {
            axios.patch(apiUrl + "/product/update", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${auth.token}`
                }
            }).then(response => {
                console.log("Product updated successfully:", response.data);
                modalValues.showSuccess("Product has been updated.");
                navigate("/product/" + productId);
            }).catch(err => {
                console.error("Error updating product:", err);
                modalValues.showError("There was an error when updating the product.");
            });
        } else {
            alert("Authentication token is missing. Please log in.");
        }
    };

    return (
        <div className={styles["form-container"]}>
            <Form className="border p-3 w-150" onSubmit={handleSubmit}>
                <Form.Group controlId="productTitle">
                    <Form.Label>Product Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter product title"
                        value={title}
                        onChange={handleTitleChange}
                        size="lg" // Larger input size
                    />
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange}/>
                </Form.Group>
                <Form.Group controlId="productPrice">
                    <Form.Label>Product Price</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter product price"
                        value={price}
                        onChange={handlePriceChange}
                        size="lg" // Larger input size
                    />
                </Form.Group>
                <Button className="mt-3" variant="primary" type="submit" size="lg"> {/* Larger button size */}
                    Update
                </Button>
            </Form>
        </div>
    )
}

export default EditProductPage;
