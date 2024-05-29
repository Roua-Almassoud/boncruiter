import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Api from '../api/Api';

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import ScrollTop from '../components/scrollTop';
import Loader from '../components/common/loader';
import Utils from '../components/utils/utils';

export default function VerifyAccount() {
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log('state in verify: ', state)
  const [form, setForm] = useState({
    email: state,
    code: "1234"
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const validate = (field = '', value = '') => {
    let errorsList = errors;
    if (field) {
      if (value) {
        if (field === 'phone' && !Utils.isEmpty(form[field])) {
          if (!Utils.validatePhoneNumber(form[field]))
            errorsList = { ...errorsList, phone: 'Invalid Phone Number!' };
        } else {
          delete errorsList[field];
        }
        delete errorsList[field];
      } else if (field !== 'phone')
        errorsList = { ...errorsList, [field]: 'Field is Required!' };
    } else {
      Object.keys(form).map((item) => {
        if (item !== 'phone' && item !== 'image') {
          if (!form[item]) {
            errorsList = { ...errorsList, [item]: 'Field is Required!' };
          } else {
            if (item === 'email') {
              if (!Utils.validateEmail(form[item]))
                errorsList = { ...errorsList, email: 'Invalid Email Address!' };
            }
          }
        } else {
          errorsList = { ...errorsList };

          if (item === 'phone' && !Utils.isEmpty(form[item])) {
            if (!Utils.validatePhoneNumber(form[item]))
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
    setLoading(true)
    if (Utils.isEmptyObject(errorsList)) {
      const response = await Api.call(form, `/user/auth/verifyAccount`, 'post', '');
      console.log('respone in verify: ', response)
      if (response.data) {
        setLoading(false)
        const userId = response.data?.data?.accessToken
        localStorage.setItem('userId', userId)
        navigate('/');
      }
    } else {
      setLoading(false)
    }
  };
  const handleChange = (value, field) => {
    validate(field, value);
    setForm({ ...form, [field]: value });
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
                      value={form?.email}
                      readOnly
                      disabled
                      aria-describedby="email"
                    />
                  </div>
                  <div className="mb-3">
                    <label for="code" className="form-label">
                      Code
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="code"
                      value={form?.code}
                      onChange={(event) =>
                        handleChange(event.target.value, 'code')
                      }
                    />
                    <div className={errors.code ? 'invalid-feedback' : ''}>
                      {errors.code}
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
