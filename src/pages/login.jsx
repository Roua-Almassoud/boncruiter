import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../api/Api';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import ScrollTop from '../components/scrollTop';
import Loader from '../components/common/loader';
import Utils from '../components/utils/utils';

export default function Login() {
  const navigate = useNavigate();
  const [alertError, setAlertError] = useState('');
  const [user, setUser] = useState({
    email: '',
    password: '',
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
            if (!Utils.regexCheck(user[item], 'phone'))
              errorsList = {
                ...errorsList,
                phone: 'Invalid Phone Number!',
              };
            else delete errorsList[field];
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
      const response = await Api.call(user, `/user/auth/login`, 'post', '');
      if (response.data.code === '200') {
        setLoading(false);
        const userId = response.data?.data?.accessToken;
        localStorage.setItem('userId', userId);
        setAlertError('');
        navigate('/profile');
      } else {
        setLoading(false);
        setAlertError(
          response.data.message || 'Something went wrong, please try again!'
        );
      }
    } else {
      setLoading(false);
      setAlertError('');
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
                  <button className="nav-button" onClick={handleSubmit}>
                    Submit
                  </button>
                  {alertError && (
                    <div class="alert alert-danger profile-alert" role="alert">
                      {alertError}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
          <div className="action">
            <button
              className="underline-button"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </button>
          </div>
        </section>

        <Footer />
        <ScrollTop />
      </>
    </>
  );
}
