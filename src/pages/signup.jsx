import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../api/Api';
import { PhoneInput } from 'react-international-phone';
//import PhoneInput from 'react-phone-input-2';
//import 'react-phone-input-2/lib/style.css';
import 'react-international-phone/style.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import ScrollTop from '../components/scrollTop';
import Loader from '../components/common/loader';
import Utils from '../components/utils/utils';
import { PhoneNumberUtil } from 'google-libphonenumber';

export default function Signup() {
  const phoneUtil = PhoneNumberUtil.getInstance();
  const navigate = useNavigate();
  const [alertError, setAlertError] = useState('');
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
  const [selectedCountry, setCountry] = useState({});
  const isPhoneValid = (phone) => {
    try {
      return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
      return false;
    }
  };
  const validate = (field = '', value = '', country = '') => {
    console.log(
      'country: ',
      country,
      'selectedCountry: ',
      selectedCountry,
      'dial: ',
      `+${selectedCountry?.country?.dialCode}`,
      'input with trim: ',
      selectedCountry?.country?.inputValue?.trim(),
      'input with trim: ',
      selectedCountry?.country?.inputValue,
      'selectedCountry.country.inputValue?.trim():',
      `+${selectedCountry?.country?.dialCode}` !==
        selectedCountry?.country?.inputValue?.trim()
    );
    let errorsList = errors;
    if (field) {
      console.log('in field');
      if (value) {
        if (field === 'phone' && !Utils.isEmpty(user[field])) {
          // if (!Utils.validatePhoneNumber(user[field]))
          //   errorsList = { ...errorsList, phone: 'Invalid Phone Number!' };
          //if (!Utils.regexCheck(user[field], 'phone'))

          if (selectedCountry) {
            if (
              `+${selectedCountry.country.dialCode}` !==
              selectedCountry.country.inputValue?.trim()
            ) {
              if (!isPhoneValid(value))
                errorsList = {
                  ...errorsList,
                  phone: 'Invalid Phone Number!',
                };
            }
          }
        } else {
          delete errorsList[field];
        }
        delete errorsList[field];
      } else if (field !== 'phone')
        errorsList = { ...errorsList, [field]: 'Field is Required!' };
    } else {
      console.log('in else');
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
            if (selectedCountry) {
              if (
                `+${selectedCountry.country.dialCode}` !==
                selectedCountry.country.inputValue?.trim()
              )
                if (!isPhoneValid(user[item]))
                  errorsList = {
                    ...errorsList,
                    phone: 'Invalid Phone Number!',
                  };
            } else delete errorsList[field];
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
      if (response.data.code === '200') {
        setLoading(false);
        const userId = response.data?.data?.User?.id;
        setAlertError('');
        navigate('/verify-account', { state: user.email });
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
  const handleChange = (value, field, country = '') => {
    setUser({ ...user, [field]: value });
    setCountry(country);
    validate(field, value, country);
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
                    <PhoneInput
                      className="number"
                      value={user?.phone}
                      onChange={(value, country, event, formattedValue) =>
                        handleChange(value, 'phone', country)
                      }
                      //onChange={(value) => handleChange(value, 'phone')}
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
                  {alertError && (
                    <div class="alert alert-danger profile-alert" role="alert">
                      {alertError}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
          {/* <div className="action">
            <button
              className="underline-button"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </div> */}
        </section>

        <Footer />
        <ScrollTop />
      </>
    </>
  );
}
