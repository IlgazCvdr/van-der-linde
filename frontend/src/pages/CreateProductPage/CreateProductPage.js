import styles from "./CreateProduct.module.css";
import { Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../config/Constants";
import AuthContext from "../../contexts/AuthContext";
import ModalContext from "../../contexts/ModalContext";
import { useNavigate } from "react-router-dom";

function CreateProductPage(props) {
    const auth = useContext(AuthContext);
    const modalContext = useContext(ModalContext);
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        axios.get(apiUrl + "/product/get-all-categories", {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })
        .then(response => {
            setCategories(response.data);
        })
        .catch(error => {
            console.error("There was an error fetching the categories!", error);
            modalContext.showError("There was an error fetching the categories.");
        });
    }, [auth.token, modalContext]);

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };

    const handleCategoryChange = (categoryName) => {
        setSelectedCategories(prevSelected => 
            prevSelected.includes(categoryName) 
                ? prevSelected.filter(category => category !== categoryName)
                : [...prevSelected, categoryName]
        );
    };

    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.set("name", title);
        formData.set("price", price);
        formData.set("image", image);
        formData.set("categories", selectedCategories);

        axios.post(apiUrl + "/product/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${auth.token}`
            }
        })
        .then(response => {
            modalContext.showSuccess("Product has been created.");
            navigate("/user/" + auth.user.id);
        })
        .catch(err => {
            modalContext.showError("There was an error when creating the product.");
        });
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className={styles["form-container"]}>
            <Form className="border p-3 w-50" onSubmit={handleSubmit}>
                <Form.Group controlId="productTitle">
                    <Form.Label>Product Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter product title"
                        value={title}
                        onChange={handleTitleChange}
                    />
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>
                <Form.Group controlId="productPrice">
                    <Form.Label>Product Price</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter product price"
                        value={price}
                        onChange={handlePriceChange}
                    />
                </Form.Group>
                <Form.Group controlId="productCategory">
                    <Form.Label>Categories</Form.Label>
                    <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
                        <Dropdown.Toggle variant="secondary" id="dropdown-categories">
                            Select Categories
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {categories.map((category) => (
                                <Dropdown.Item
                                    key={category.id}
                                    as="div"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent dropdown from closing
                                        handleCategoryChange(category.name);
                                    }}
                                >
                                    <Form.Check 
                                        type="checkbox"
                                        id={`category-${category.id}`}
                                        label={category.name}
                                        value={category.name}
                                        checked={selectedCategories.includes(category.name)}
                                        onChange={() => handleCategoryChange(category.name)}
                                    />
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>
                <Button className="mt-2" variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default CreateProductPage;
