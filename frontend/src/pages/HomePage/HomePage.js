import axios from "axios";
import ProductList from "../../components/ProductList/ProductList";
import { apiUrl } from "../../config/Constants";
import { useEffect, useState, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import styles from "./HomePage.module.css";
import AuthContext from "../../contexts/AuthContext";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState(null);
  const location = useLocation();
  const userAuth = useContext(AuthContext); // Access the AuthContext

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search');

    const fetchProducts = async () => {
      try {
        const config = {}; // Initialize an empty config object

        // Check if the user is logged in and token exists in the AuthContext
        if (userAuth.token) {
          console.log(userAuth.token)
          if (userAuth.token == "null") {
            config.headers = {
              Authorization: `${userAuth.token}` // Include the authorization token in the request headers
            };
          } else {
            config.headers = {
              Authorization: `Bearer ${userAuth.token}` // Include the authorization token in the request headers
            };
          }

        }

        let response;

        if (!userAuth.user) {
          if (searchTerm) {
            response = await axios.get(`${apiUrl}/product/search`, { params: { q: searchTerm }, ...config })
          } else {
            response = await axios.get(`${apiUrl}/product/all`, config);
          }
        }

        if (userAuth.user) {
          if (searchTerm) {
            response = await axios.get(`${apiUrl}/product/search?q=` + searchTerm, { headers: { Authorization: `Bearer ${userAuth.token}` } })
          } else {
            response = await axios.get(`${apiUrl}/product/get-recommendations`, { headers: { Authorization: `Bearer ${userAuth.token}` } });
            const response2 = await axios.get(`${apiUrl}/product/all`);
            setAllProducts(response2.data);
          }
        }

        setProducts(response.data);


      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();

  }, [location.search, userAuth.token]); // Include userAuth.token in the dependencies array

  return (
    <div className="container">
      {products.length > 0 ? (
        <div>
        {userAuth.user ? (<h1>Recommendations</h1>) : (<h1>All Products</h1>)}
        <ProductList products={products} /></div>
      ) : (
        <div></div>
      )}
      <br></br>
      <br></br>

      {allProducts ? (
        <>
          <h1>All Products</h1>
          <ProductList products={allProducts} />
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default HomePage;
