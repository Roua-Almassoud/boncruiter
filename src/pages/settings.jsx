import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Api from '../api/Api';

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import ScrollTop from '../components/scrollTop';
import Loader from '../components/common/loader';
import Utils from '../components/utils/utils';
import { PhoneInput } from 'react-international-phone';
import { PhoneNumberUtil } from 'google-libphonenumber';

export default function Settings() {
  const phoneUtil = PhoneNumberUtil.getInstance();
  const initialSection = 'updateProfile';
  const navigate = useNavigate();
  const [alertError, setAlertError] = useState('');
  const [alertSuccess, setAlertSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(initialSection);
  const [selectedCountry, setCountry] = useState({});
  const [form, setForm] = useState({});
  const isPhoneValid = (phone) => {
    try {
      return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
      return false;
    }
  };

  const getProfile = async () => {
    setLoading(true);
    const response = await Api.call({}, `/user/profile`, 'get', '');
    if (response.data.code === '200') {
      const profile = response.data.data;
      setForm({
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    getProfile();
  }, []);
  const validate = (field = '', value = '', country = '') => {
    let errorsList = errors;
    if (field) {
      if (value) {
        if (field === 'phone' && !Utils.isEmpty(form[field])) {
          if (selectedCountry) {
            if (
              `+${selectedCountry.country.dialCode}` !==
              selectedCountry.inputValue?.trim()
            ) {
              if (!isPhoneValid(value))
                errorsList = {
                  ...errorsList,
                  phone: 'Invalid Phone Number!',
                };
            }
          }
        } else if (
          field === 'confirmPassword' &&
          form.newPassword !== form.confirmPassword
        ) {
          errorsList = { ...errorsList, [field]: "Passwords don't match.!" };
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
            if (
              item === 'confirmPassword' &&
              form.newPassword !== form.confirmPassword
            ) {
              console.log('in mmm fieldssss');
              errorsList = {
                ...errorsList,
                confirmPassword: "Passwords don't match.!",
              };
            }
          }
        } else {
          errorsList = { ...errorsList };
          if (item === 'phone' && !Utils.isEmpty(form[item])) {
            if (!Utils.isEmptyObject(selectedCountry)) {
              if (
                `+${selectedCountry?.country?.dialCode}` !==
                selectedCountry.inputValue?.trim()
              )
                if (!isPhoneValid(form[item]))
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
    const pathname =
      selectedSection === 'updateProfile'
        ? '/user/profile'
        : '/user/profile/password';
    if (Utils.isEmptyObject(errorsList)) {
      const response = await Api.call(form, pathname, 'put', '');
      if (response.data.code === '200') {
        setLoading(false);
        setAlertSuccess('Updated Successfully!');
      } else {
        const errorMsg = response?.data?.message;
        setAlertError(errorMsg);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };
  const handleChange = (value, field, country = '') => {
    setForm({ ...form, [field]: value });
    setCountry(country);
    validate(field, value, country);
  };

  const changeSection = (section) => {
    setSelectedSection(section);
    const newForm =
      section === 'updateProfile'
        ? {
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
          }
        : {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          };
    setForm(newForm);
    setAlertError('');
    setAlertSuccess('');
  };

  return (
    <>
      {loading && <Loader />}
      <>
        <Navbar navClass="defaultscroll sticky" />
        <section className="bg-half-170 d-table w-100 bg-container">
          <div className="row g-4 align-items-top justify-content-left">
            <div className="col-3 sections-tab">
              <ul class="nav flex-column">
                <li
                  class={`nav-item ${
                    selectedSection === 'updateProfile' ? 'active' : ''
                  }`}
                  onClick={() => changeSection('updateProfile')}
                >
                  <a class="nav-link">{'Update Profile'}</a>
                </li>
                <li
                  class={`nav-item ${
                    selectedSection === 'changePassword' ? 'active' : ''
                  }`}
                  onClick={() => changeSection('changePassword')}
                >
                  <a class="nav-link">{'Change Password'}</a>
                </li>
              </ul>
            </div>
            <div className="col-8 form-column">
              <h3>{Utils.capitalizeFirstLetter(selectedSection)}</h3>
              {!loading &&
                (selectedSection === 'updateProfile' ? (
                  <form onSubmit={(event) => event.preventDefault()}>
                    <div className="mb-3">
                      <label for="firstName" className="form-label">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        value={form?.firstName}
                        onChange={(event) =>
                          handleChange(event.target.value, 'firstName')
                        }
                      />
                      <div
                        className={errors.firstName ? 'invalid-feedback' : ''}
                      >
                        {errors.firstName}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label for="lastName" className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={form?.lastName}
                        onChange={(event) =>
                          handleChange(event.target.value, 'lastName')
                        }
                        className="form-control"
                        id="lastName"
                        aria-describedby="lastName"
                      />
                      <div
                        className={errors.lastName ? 'invalid-feedback' : ''}
                      >
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
                        value={form?.email}
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
                      <label for="phoneNumber" className="form-label">
                        Phone Number
                      </label>
                      <PhoneInput
                        className="number"
                        value={form.phone ? form.phone : ''}
                        onChange={(value, country, event, formattedValue) =>
                          handleChange(value, 'phone', country)
                        }
                      />
                      <div className={errors.phone ? 'invalid-feedback' : ''}>
                        {errors.phone}
                      </div>
                    </div>

                    <button className="nav-button" onClick={handleSubmit}>
                      Save
                    </button>
                    {alertError && (
                      <div
                        class="alert alert-danger profile-alert"
                        role="alert"
                      >
                        {alertError}
                      </div>
                    )}
                  </form>
                ) : (
                  <form onSubmit={(event) => event.preventDefault()}>
                    <div className="mb-3">
                      <label for="password" className="form-label">
                        Old Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={form?.oldPassword}
                        onChange={(event) =>
                          handleChange(event.target.value, 'oldPassword')
                        }
                      />
                      <div
                        className={errors.oldPassword ? 'invalid-feedback' : ''}
                      >
                        {errors.oldPassword}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label for="password" className="form-label">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        value={form?.newPassword}
                        onChange={(event) =>
                          handleChange(event.target.value, 'newPassword')
                        }
                      />
                      <div
                        className={errors.newPassword ? 'invalid-feedback' : ''}
                      >
                        {errors.newPassword}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label for="password" className="form-label">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        value={form?.confirmPassword}
                        onChange={(event) =>
                          handleChange(event.target.value, 'confirmPassword')
                        }
                      />
                      <div
                        className={
                          errors.confirmPassword ? 'invalid-feedback' : ''
                        }
                      >
                        {errors.confirmPassword}
                      </div>
                    </div>
                    <button className="nav-button" onClick={handleSubmit}>
                      Save
                    </button>
                    {alertError.length > 0 && (
                      <div
                        class="alert alert-danger profile-alert"
                        role="alert"
                      >
                        {alertError}
                      </div>
                    )}
                    {alertSuccess.length > 0 && (
                      <div
                        class="alert alert-success profile-alert"
                        role="alert"
                      >
                        {alertSuccess}
                      </div>
                    )}
                  </form>
                ))}
            </div>
          </div>
        </section>

        <Footer />
        <ScrollTop />
      </>
    </>
  );
}
