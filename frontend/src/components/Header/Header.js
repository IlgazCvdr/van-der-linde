import SearchBar from "../SearchBar/SearchBar";
import styles from "./Header.module.css";
import logo from "../../assets/logo-cropped.png";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../contexts/AuthContext";
import { Button, Dropdown } from "react-bootstrap";
import axios from "axios";
import { apiUrl } from "../../config/Constants";

function Header({ onSearch }) {
  const authValues = useContext(AuthContext);
  let navigate = useNavigate();

  function onLogoutClick(event) {
    localStorage.setItem("token", null);
    authValues.setUser(null);
    authValues.setToken(null);
    navigate("/");
    window.location.reload();
  }

  function onProfileClick(event) {
    navigate("/user/" + authValues.user.id);
  }

  function onLoginClick(event) {
    navigate("/login-register");
  }

  function onAdminDashboardClick(event) {
    navigate("/admin-dashboard");
  }

  function onForumClick(event) {
    navigate("/forums"); // Navigating to the forum page
  }

  const handleSearch = (searchTerm) => {
    navigate(`/?search=${searchTerm}`);
  };

  return (
    <div className={styles["header"]}>
      <div className={styles["header-contents"]}>
        <Link to="/">
          <img className={styles["logo"]} src={logo}></img>
        </Link>
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Community
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={onForumClick}>Forum</Dropdown.Item>
            <Dropdown.Item onClick={() => { navigate("/qa") }}>Q&A</Dropdown.Item>
            <Dropdown.Item onClick={() => { navigate("/local-communities") }}>Local Community</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <SearchBar onSearch={handleSearch} />
        <div className={styles["account"]}>
          {authValues.user ? (
            <div className={styles["auth-buttons-container"]}>
              <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  {authValues.user.firstName}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={onProfileClick}>Profile</Dropdown.Item>
                  {(() => {
                    if (authValues.user.roleNames.includes("admin") || authValues.user.roleNames.includes("admın")) {
                      return (
                        <Dropdown.Item onClick={onAdminDashboardClick}>Admin Dashboard</Dropdown.Item>
                      );
                    }
                    if (authValues.user.roleNames.includes("merchant")) {
                      return (
                        <Dropdown.Item onClick={() => {navigate("/merchant-dashboard")}}>Merchant Dashboard</Dropdown.Item>
                      )
                    }
                  })()}
                  <Dropdown.Item onClick={onLogoutClick}>Log out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : (
            <Button variant="secondary" onClick={onLoginClick}>Login</Button>
          )}
        </div>

      </div>
    </div>
  );
}

export default Header;
