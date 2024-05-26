import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoDark from '../assets/images/logo-dark.png';
import logoLight from '../assets/images/logo-light.png';
import bonzuttner from '../assets/images/bonzuttner-without-bg.png';
import client from '../assets/images/team/07.jpg';
import { LuSearch,FiUser,FiSettings,FiLock,FiLogOut } from "../assets/icons/vander";

export default function Navbar({ navClass, navLight }) {
  const navigate = useNavigate();
  let [isOpen, setMenu] = useState(true);
  let [scroll, setScroll] = useState(false);
  let [search, setSearch] = useState(false);
  let [cartitem, setCartitem] = useState(false);

  let [manu, setManu] = useState('');
  let location = useLocation();
  useEffect(() => {
    let current = location.pathname.substring(
      location.pathname.lastIndexOf('/') + 1
    );
    setManu(current);
  }, [location.pathname.substring(location.pathname.lastIndexOf('/') + 1)]);

  useEffect(() => {
    function scrollHandler() {
      setScroll(window.scrollY > 50);
    }
    window.addEventListener('scroll', scrollHandler);

    let searchModal = () => {
      setSearch(false);
    };
    document.addEventListener('mousedown', searchModal);

    let cartModal = () => {
      //setCartitem(false);
    };
    document.addEventListener('mousedown', cartModal);
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener('scroll', scrollHandler);
      document.removeEventListener('mousedown', searchModal);
      document.removeEventListener('mousedown', cartModal);
    };
  }, []);
  const toggleMenu = () => {
    setMenu(!isOpen);
    if (document.getElementById('navigation')) {
      const anchorArray = Array.from(
        document.getElementById('navigation').getElementsByTagName('a')
      );
      anchorArray.forEach((element) => {
        element.addEventListener('click', (elem) => {
          const target = elem.target.getAttribute('href');
          if (target !== '') {
            if (elem.target.nextElementSibling) {
              var submenu = elem.target.nextElementSibling.nextElementSibling;
              submenu.classList.toggle('open');
            }
          }
        });
      });
    }
  };
  return (
    <header id="topnav" className={`${scroll ? 'nav-sticky' : ''} ${navClass}`}>
      <div className="container">
        {navLight === true ? (
          <Link className="logo" to="/">
            <span className="logo-light-mode">
              <img src={logoDark} className="l-dark" alt="" />
              <img src={logoLight} className="l-light" alt="" />
            </span>
            <img src={logoLight} className="logo-dark-mode" alt="" />
          </Link>
        ) : (
          <Link className="logo" to="/">
            <span className="logo-light-mode">
              <img src={bonzuttner} className="l-dark" alt="" />
              <img src={bonzuttner} className="l-light" alt="" />
            </span>
            <img src={bonzuttner} className="logo-dark-mode" alt="" />
          </Link>
        )}
        <div className="menu-extras">
          <div className="menu-item">
            <Link
              to="#"
              className="navbar-toggle"
              id="isToggle"
              onClick={toggleMenu}
            >
              <div className="lines">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </Link>
          </div>
        </div>

        <ul className="buy-button list-inline mb-0">
          <li className="list-inline-item ps-1 mb-0">
            <div className="dropdown">
              {/* <button type="button" onClick={() => setSearch(!search)} className="dropdown-toggle btn btn-sm btn-icon btn-pills btn-primary">
                            <LuSearch className="icons"/>
                        </button> */}
              {/* <button className="dropdown-toggle btn btn-sm btn-icon btn-pills btn-primary">Sign up</button> */}
              <div style={{ display: search === true ? 'block' : 'none' }}>
                <div
                  className={`dropdown-menu dd-menu dropdown-menu-end bg-white rounded border-0 mt-3 p-0 show`}
                  style={{ width: '240px', position: 'absolute', right: '0' }}
                >
                  <div className="search-bar">
                    <div id="itemSearch" className="menu-search mb-0">
                      <form
                        role="search"
                        method="get"
                        id="searchItemform"
                        className="searchform"
                      >
                        <input
                          type="text"
                          className="form-control rounded border"
                          name="s"
                          id="searchItem"
                          placeholder="Search..."
                        />
                        <input
                          type="submit"
                          id="searchItemsubmit"
                          value="Search"
                        />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>

          <li className="list-inline-item ps-1 mb-0">
            <div className="dropdown dropdown-primary">
              {localStorage.getItem('userId') ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setCartitem(!cartitem)}
                    className="dropdown-toggle btn btn-sm btn-icon btn-pills btn-primary"
                  >
                    <img
                      src={client}
                      className="img-fluid rounded-pill"
                      alt=""
                    />
                  </button>
                  <div
                    style={{ display: cartitem === true ? 'block' : 'none' }}
                  >
                    <div
                      className={` dropdown-menu dd-menu dropdown-menu-end bg-white rounded shadow border-0 mt-3 show`}
                    >
                      <Link
                        to="/profile"
                        className="dropdown-item fw-medium fs-6"
                      >
                        <FiUser className="fea icon-sm me-2 align-middle" />
                        Profile
                      </Link>
                      <Link
                        to="candidate-profile-setting"
                        className="dropdown-item fw-medium fs-6"
                      >
                        <FiSettings className="fea icon-sm me-2 align-middle" />
                        Settings
                      </Link>
                      <div className="dropdown-divider border-top"></div>

                      <Link className="dropdown-item fw-medium fs-6"
                      onClick={() => {
                        localStorage.removeItem('userId')
                        console.logg('afterr clear')
                        navigate('/index')}}>
                        <FiLogOut className="fea icon-sm me-2 align-middle" />
                        Logout
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/signup">
                  <button className="nav-button">Sign up</button>
                </Link>
              )}
            </div>
          </li>
        </ul>

        <div id="navigation">
          <ul className="navigation-menu nav-right nav-light">
            <li
              className={`${
                ['', 'index', 'index-two', 'index-three'].includes(manu)
                  ? 'active'
                  : ''
              } has-submenu parent-menu-item`}
            >
              <Link to="/index">Home</Link>
              <span className="menu-arrow"></span>
              <ul className="submenu">
                <li className={manu === 'index' || '' ? 'active' : ''}>
                  <Link to="/index" className="sub-menu-item">
                    Hero One
                  </Link>
                </li>
                <li className={manu === 'index-two' ? 'active' : ''}>
                  <Link to="/index-two" className="sub-menu-item">
                    Hero Two
                  </Link>
                </li>
                <li className={manu === 'index-three' ? 'active' : ''}>
                  <Link to="/index-three" className="sub-menu-item">
                    Hero Three
                  </Link>
                </li>
              </ul>
            </li>
            <li className={manu === 'contactus' ? 'active' : ''}>
              <Link to="/contactus" className="sub-menu-item">
                Contact Us
              </Link>
            </li>
            <li className={manu === 'contactus' ? 'active' : ''}>
              <Link to="/upload" className="sub-menu-item">
                Upload your CV
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
