import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Api from '../api/Api';

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import ScrollTop from '../components/scrollTop';
import Loader from '../components/common/loader';
import Utils from '../components/utils/utils';
import Section from '../components/common/section';
import Nav from 'react-bootstrap/Nav';

export default function Profile() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const sectionsList = [
    'basicInfo',
    'skills',
    'languages',
    'education',
    'certificates',
    'projects',
    'experiences',
  ];
  let cvData = !Utils.isEmpty(state)
    ? state.data
    : {
        basicInfo: {},
        skills: [],
        languages: [],
        education: [],
        certificates: [],
        projects: [],
        experiences: [],
      };

  const [userSections, setUserSections] = useState(cvData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedSection, setSelectedSection] = useState('basicInfo');
  const [skills, setSkills] = useState([]);
  const getFullProfile = async () => {
    setLoading(true);
    const response = await Api.call({}, `/user/full`, 'get', '');
    if (response.data) {
      let fullData = response.data.data;
      setUserSections(fullData);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const getAvailableSkills = async () => {
    setLoading(true);
    const response = await Api.call({}, `/user/available-skills`, 'get', '');
    if (response.data) {
      let availableSkills = response.data.data.list.map((skill) => {
        return { id: skill.id, name: skill.name };
      });
      if (userSections['skills']) {
        userSections['skills'].map((userSkill) => {
          availableSkills.push({
            id: userSkill.skillId,
            name: userSkill.skillName,
          });
        });
      }
      setSkills(availableSkills);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Utils.isEmpty(state)) {
      getFullProfile();
    }
  }, []);
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
    setSelectedSection(section);
    const selectedIndex = sectionsList.indexOf(selectedSection);
    const nextSectionKey = sectionsList[selectedIndex + 1];
    if (nextSectionKey === 'skills') {
      getAvailableSkills();
    }
  };

  const next = () => {
    const selectedIndex = sectionsList.indexOf(selectedSection);
    const nextSectionKey = sectionsList[selectedIndex + 1];
    setSelectedSection(nextSectionKey);
    if (nextSectionKey === 'skills') {
      getAvailableSkills();
    }
  };

  const renderSections = () => {
    let sections = [];
    if (userSections) {
      Object.keys(userSections).forEach(function (key, index) {
        sections.push(
          <li
            class={`nav-item ${selectedSection === key ? 'active' : ''}`}
            onClick={() => changeSection(key)}
          >
            <a class="nav-link">
              {key === 'basicInfo'
                ? 'Basic Information'
                : Utils.capitalizeFirstLetter(key)}
            </a>
          </li>
        );
      });
    }
    return sections;
  };

  const userSkills = () => {
    let formattedUserSkills = [];
    if (userSections['skills']) {
      userSections['skills'].map((userSkill) => {
        formattedUserSkills.push({
          id: userSkill.skillId,
          name: userSkill.skillName,
        });
      });
    }
    return formattedUserSkills;
  };

  return (
    <>
      {loading && <Loader />}
      <>
        <Navbar navClass="defaultscroll sticky" />
        <section className="bg-half-170 d-table w-100 bg-container">
          <div className="row g-4 align-items-top justify-content-left">
            <div className="col-3 sections-tab">
              <ul class="nav flex-column">{renderSections()}</ul>
            </div>
            <div className="col-8 form-column">
              <h3>
                {selectedSection === 'basicInfo'
                  ? 'Basic Information'
                  : Utils.capitalizeFirstLetter(selectedSection)}
              </h3>
              <Section
                section={selectedSection}
                sectionData={
                  selectedSection === 'skills'
                    ? userSkills()
                    : userSections[selectedSection]
                }
                loading={setLoading}
                next={next}
                availableSkills={skills}
              />
            </div>
          </div>
        </section>

        <Footer />
        <ScrollTop />
      </>
    </>
  );
}
