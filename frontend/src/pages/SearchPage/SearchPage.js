import axios from "axios";
import ProductList from "../../components/ProductList/ProductList";
import styles from "./SearchPage.module.css";
import { apiUrl } from "../../config/Constants";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

function SearchPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const userAuth = useContext(AuthContext);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search');

    const fetchProducts = async () => {
      try {
        if (searchTerm) {
          const response = await axios.get(`${apiUrl}/product/search`, { 
            params: { q: searchTerm },
            headers: {
                Authorization: `Bearer ${userAuth.token}`    
            }
            });
          if (response.data && response.data.length > 0) {
            setProducts(response.data);
          } else {
            setProducts([]);
          }
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {products.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <h1>No Products Found</h1>
      )}
    </div>
  );
}

export default SearchPage;
