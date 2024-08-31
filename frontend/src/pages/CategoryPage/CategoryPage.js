import axios from "axios";
import ProductList from "../../components/ProductList/ProductList";
import { apiUrl } from "../../config/Constants";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function CategoryPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const { categoryName: categoryParam } = useParams();

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await axios.get(`${apiUrl}/product/get-category?categoryName=${categoryParam}`);
        setProducts(response.data);
        setCategoryName(categoryParam); // Set the category name from the URL parameter
      } catch (err) {
        console.log(err);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(apiUrl + "/product/get-all-categories");
        setCategories(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProductsByCategory();
    fetchCategories();
  }, [categoryParam]);

  return (
    <div className="container">
      <h2>Category: {categoryName}</h2>
      {products.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <h1>No Products Found in this Category</h1>
      )}
    </div>
  );
}

export default CategoryPage;
