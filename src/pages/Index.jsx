import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import ScrollTop from '../components/scrollTop';
import { FiSearch, FiMapPin } from '../assets/icons/vander';
import Api from '../api/Api';
import Select from 'react-dropdown-select';
import Multiselect from 'multiselect-react-dropdown';

export default function Index() {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    title: '',
    location: '',
    skills: [],
  });
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const jobTypes = [
    { id: '1', name: 'Remote' },
    { id: '2', name: 'On-site' },
    { id: '3', name: 'Hybird' },
  ];

  const onSelect = (selectedList, selectedItem) => {
    setSelectedSkills(selectedList);
  };

  const onRemove = (selectedList, removedItem) => {
    setSelectedSkills(selectedList);
  };

  const getSkills = async () => {
    const response = await Api.call({}, `/user/available-skills`, 'get', '');
    if (response.data) {
      let availableSkills = response.data.data.list.map((skill) => {
        return { id: skill.id, name: skill.name };
      });

      setSkills(availableSkills);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSkills();
  }, []);

  const handleChange = (value, field) => {
    setSearchForm({ ...searchForm, [field]: value });
  };
  const handleSearch = () => {
    console.log('searchForm: ', searchForm, 'seleelle: ', selectedSkills);
    if (selectedSkills.length > 0) searchForm.skills = selectedSkills;
    navigate('/jobs', { state: searchForm });
  };
  return (
    <>
      <Navbar navClass="defaultscroll sticky" />
      <section className="bg-half-170 d-table w-100 bg-container">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-6">
              <div className="title-heading">
                <h1 className="heading fw-bold">
                  Get hired <br /> by the popular <br /> candidates.
                </h1>
                <p className="para-desc  mb-0">
                  Find Jobs, Employment & Career Opportunities. Some of the
                  companies we've helped recruit excellent applicants over the
                  years.
                </p>

                {/* <div className="text-center subscribe-form mt-4">
                  <form style={{ maxWidth: '800px' }}>
                    <div className="mb-0">
                      <div className="position-relative">
                        <FiSearch className="fea icon-20 position-absolute top-50 start-0 translate-middle-y ms-3" />
                        <input
                          type="text"
                          id="help"
                          name="name"
                          className="shadow rounded-pill bg-white ps-5"
                          required=""
                          placeholder="Search jobs & candidates ..."
                        />
                      </div>
                      <button type="submit" className="nav-button">
                        Search
                      </button>
                    </div>
                  </form>
                </div> */}
              </div>
            </div>

            <div className="col-md-6">
              <div className="position-relative ms-lg-5"></div>
            </div>
          </div>
          <div className="container subscribe-form mt-4">
            <div className="search-form">
              <form
                className="form-inline row align-items-center justify-content-center"
                onSubmit={(event) => event.preventDefault()}
              >
                <div className="form-group col position-relative">
                  <FiSearch className="fea icon-20 position-absolute top-50 end-0 translate-middle-y mx-4" />
                  <input
                    type="text"
                    id="help"
                    name="name"
                    className="shadow bg-white"
                    required=""
                    placeholder="Job Title"
                    value={searchForm.title}
                    onChange={(event) =>
                      handleChange(event.target.value, 'title')
                    }
                  />
                </div>
                <div className="form-group col position-relative">
                  <FiMapPin className="fea icon-20 position-absolute top-50 end-0 translate-middle-y mx-4" />
                  <input
                    type="text"
                    id="help"
                    name="name"
                    className="shadow bg-white"
                    required=""
                    placeholder="Location"
                    value={searchForm.location}
                    onChange={(event) =>
                      handleChange(event.target.value, 'location')
                    }
                  />
                  {/* <Select
                    multi={false}
                    options={jobTypes}
                    labelField={'name'}
                    valueField="id"
                    value={searchForm.location}
                    onChange={(value) =>
                      handleChange(value[0]?.name, 'location')
                    }
                    placeholder={'Job Type'}
                  /> */}
                </div>
                <div className="form-group col position-relative">
                  <Multiselect
                    className={`skills-select shadow bg-white${
                      selectedSkills.length === 0 ? 'with-placeholder' : ''
                    }`}
                    options={skills}
                    selectedValues={selectedSkills}
                    onSelect={onSelect}
                    onRemove={onRemove}
                    placeholder={'Skills'}
                    displayValue="name"
                  />
                </div>
                <div className="form-group col col-2 position-relative">
                  <button
                    type="submit"
                    className="nav-button"
                    onClick={() => handleSearch()}
                  >
                    SEARCH
                    <FiSearch className="fea icon-20 position-absolute top-50 end-0 translate-middle-y mx-2" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <ScrollTop />
    </>
  );
}
