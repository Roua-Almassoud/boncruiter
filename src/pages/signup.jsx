import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../api/Api';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import ScrollTop from '../components/scrollTop';
import Loader from '../components/common/loader';
import Utils from '../components/utils/utils';

export default function Signup() {
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
  const validate = (field = '', value = '') => {
    let errorsList = errors;
    if (field) {
      if (value) {
        if (field === 'phone' && !Utils.isEmpty(user[field])) {
          // if (!Utils.validatePhoneNumber(user[field]))
          //   errorsList = { ...errorsList, phone: 'Invalid Phone Number!' };
        } else {
          delete errorsList[field];
        }
        delete errorsList[field];
      } 
      else if (field !== 'phone')
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

          // if (item === 'phone' && !Utils.isEmpty(user[item])) {
          //   if (!Utils.validatePhoneNumber(user[item]))
          //     errorsList = { ...errorsList, phone: 'Invalid Phone Number!' };
          // }
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

        navigate('/verify-account', { state: user.email });
      }
    } else {
      setLoading(false);
    }
  };
  const handleChange = (value, field) => {
    validate(field, value);
    setUser({ ...user, [field]: value });
  };
  return (
    <>
      {loading && <Loader />}
      <>
        <Navbar navClass="defaultscroll sticky" />
        <section
          className="bg-half-170 d-table w-100 bg-container"
          // style={{backgroundImage:`url(${bg1})`, backgroundPosition:'center'}}
        >
          <div className="container">
            <div className="row g-4 align-items-center justify-content-center">
              <div className="col-md-8 signup-form">
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
                    {/* <input
                      type="number"
                      className="form-control"
                      id="phoneNumber"
                      value={user?.phone}
                      onChange={(event) =>
                        handleChange(event.target.value, 'phone')
                      }
                    /> */}

                  <PhoneInput
                    className="number"
                    country={"us"}
                    value={user?.phone}
                      onChange={(event) =>
                        handleChange(event, 'phone')
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
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <Footer />
        <ScrollTop />
      </>
    </>
  );
}
