import styles from "./SearchBar.module.css";
import { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch(searchTerm);
    }
  };

  return (
    <div className={styles["search-bar"]}>
      <input
        className={styles["search-input"]}
        placeholder="Search for anything"
        value={searchTerm}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
}

export default SearchBar;
