import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../api/Api';

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import ScrollTop from '../components/scrollTop';
import Loader from '../components/loader';
import Utils from '../components/utils/utils';
import Signup from './signup';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedSection, setSelectedSection] = useState(0)
  const validate = (field = '', value = '') => {
    let errorsList = errors;
    if (field) {
      if (value) {
        if (field === 'phone' && !Utils.isEmpty(user[field])) {
          if (!Utils.validatePhoneNumber(user[field]))
            errorsList = { ...errorsList, phone: 'Invalid Phone Number!' };
        } else {
          delete errorsList[field];
        }
        delete errorsList[field];
      } else if (field !== 'phone')
        errorsList = { ...errorsList, [field]: 'Field is Required!' };
    } else {
      Object.keys(user).map((item) => {
        if (item !== 'phone' && item !== 'image') {
          if (!user[item]) {
            errorsList = { ...errorsList, [item]: 'Field is Required!' };
          } else {
            if (item === 'email') {
              if (!Utils.validateEmail(user[item]))
                errorsList = { ...errorsList, email: 'Invalid Email Address!' };
            }
          }
        } else {
          errorsList = { ...errorsList };

          if (item === 'phone' && !Utils.isEmpty(user[item])) {
            if (!Utils.validatePhoneNumber(user[item]))
              errorsList = { ...errorsList, phone: 'Invalid Phone Number!' };
          }
        }
      });
    }
    setErrors(errorsList);
    return errorsList;
  };
  const handleSubmit = async () => {
    const errorsList = validate();
    setLoading(true);
    if (Utils.isEmptyObject(errorsList)) {
      const response = await Api.call(user, `/user/auth/register`, 'post', '');
      if (response.data) {
        setLoading(false);
        const userId = response.data?.data?.User?.id;
        localStorage.setItem('userId', userId);
        navigate('/index');
      }
    } else {
      setLoading(false);
    }
  };
  const handleChange = (value, field) => {
    validate(field, value);
    setUser({ ...user, [field]: value });
  };

  const changeSection = (section) => {
    setSelectedSection(section)
  }

  const tabName = selectedSection === 0?
  'Basic Information': selectedSection === 1?'Skills':selectedSection === 2? 'Experiences':'Languages'

  return (
    <>
      {loading && <Loader />}
      <>
        <Navbar navClass="defaultscroll sticky" />
        <section className="bg-half-170 d-table w-100 bg-container">
          <div className="row g-4 align-items-top justify-content-left">
            <div className="col-3 sections-tab">
              <ul class="nav flex-column">
                <li class={`nav-item ${selectedSection === 0? 'active': ''}`}
                onClick={() => changeSection(0)}>
                  <a class="nav-link">
                    Basic Information
                  </a>
                </li>
                <li class={`nav-item ${selectedSection === 1? 'active': ''}`}
                onClick={() => changeSection(1)}>
                  <a class="nav-link">
                    Skills
                  </a>
                </li>
                <li class={`nav-item ${selectedSection === 2? 'active': ''}`}
                onClick={() => changeSection(2)}>
                  <a class="nav-link">
                  Experiences
                  </a>
                </li>
                <li class={`nav-item ${selectedSection === 3? 'active': ''}`}
                onClick={() => changeSection(3)}>
                  <a class="nav-link">
                    Languages
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-8 form-column">
              <h3>{tabName}</h3>
            <form onSubmit={(event) => event.preventDefault()}>
                  <div className="mb-3">
                    <label for="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      value={user?.firstName}
                      onChange={(event) =>
                        handleChange(event.target.value, 'firstName')
                      }
                    />
                    <div className={errors.firstName ? 'invalid-feedback' : ''}>
                      {errors.firstName}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label for="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={user?.lastName}
                      onChange={(event) =>
                        handleChange(event.target.value, 'lastName')
                      }
                      className="form-control"
                      id="lastName"
                      aria-describedby="lastName"
                    />
                    <div className={errors.lastName ? 'invalid-feedback' : ''}>
                      {errors.lastName}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label for="email" className="form-label">
                      Email address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      value={user?.email}
                      onChange={(event) =>
                        handleChange(event.target.value, 'email')
                      }
                      aria-describedby="email"
                    />
                    <div className={errors.email ? 'invalid-feedback' : ''}>
                      {errors.email}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label for="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={user?.password}
                      onChange={(event) =>
                        handleChange(event.target.value, 'password')
                      }
                    />
                    <div className={errors.password ? 'invalid-feedback' : ''}>
                      {errors.password}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label for="phoneNumber" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="phoneNumber"
                      value={user?.phone}
                      onChange={(event) =>
                        handleChange(event.target.value, 'phone')
                      }
                    />
                    <div className={errors.phone ? 'invalid-feedback' : ''}>
                      {errors.phone}
                    </div>
                  </div>

                  <button
                    //type="submit"
                    className="nav-button"
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
                </form>
            </div>
          </div>
        </section>

        <Footer />
        <ScrollTop />
      </>
    </>
  );
}
