import React, { useState, useEffect } from 'react';
import {  useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import { FiSearch, FiMapPin } from '../assets/icons/vander';
import Footer from '../components/footer';
import ScrollTop from '../components/scrollTop';
import Loader from '../components/common/loader';
import Api from '../api/Api';
import Select from 'react-dropdown-select';
import Job from '../components/common/job';
import Multiselect from 'multiselect-react-dropdown';

export default function JobList() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const initialForm = state || { title: '', location: '', skills: '' };
  const [loading, setLoading] = useState(true);
  const [searchForm, setSearchForm] = useState(initialForm);
  const [jobsList, setJobsList] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const jobTypes = [
    { id: '1', name: 'Remote' },
    { id: '2', name: 'On-site' },
    { id: '3', name: 'Hybird' },
  ];
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
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
  const getJobs = async () => {
    const skillsSelected =
      selectedSkills.length > 0 ? selectedSkills : searchForm?.skills || '';
    const title = searchForm?.title || '';
    const skills =
      skillsSelected?.map((skill) => {
        return skill.id;
      }) || '';
    const location = searchForm?.location || '';
    console.log('skills: ', skills.join(','));
    let link = '/job?';
    if (title) link = link + 'title=' + title + '&';
    if (location) link = link + 'location=' + location + '&';
    if (skills.length > 0) link = link + 'skills=' + skills.join(',') + '&';
    if (currentPage > 0) link = link + 'page=' + currentPage + '&';
    const response = await Api.call({}, link, 'get', '');
    if (response.data.code === '200') {
      let jobs = response.data.data.jobs;
      const pages = response.data.data.pages;
      setJobsList(jobs);
      setPages(pages);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
    getSkills();
  }, [currentPage]);

  const handleChange = (value, field) => {
    setSearchForm({ ...searchForm, [field]: value });
  };

  const handleSearch = () => {
    setLoading(true);
    getJobs();
  };

  const onSelect = (selectedList, selectedItem) => {
    setSelectedSkills(selectedList);
  };

  const onRemove = (selectedList, removedItem) => {
    setSelectedSkills(selectedList);
  };

  const pageChanged = (page) => {
    setCurrentPage(page);
  };

  const renderPages = () => {
    let pagesNumbers = [];
    for (let i = 1; i <= pages; i++) {
      pagesNumbers.push(
        <li
          className={`page-item ${currentPage === i && 'active'}`}
          onClick={() => pageChanged(i)}
        >
          <a class="page-link" href="#">
            {i}
          </a>
        </li>
      );
    }
    return <>{pagesNumbers}</>;
  };
  return (
    <>
      {loading && <Loader />}
      <>
        <Navbar navClass="defaultscroll sticky" />
        <section className="bg-half-170 d-table w-100 bg-container jobs-list">
          <div className="container">
            <div className="row mt-5 justify-content-center">
              <div className="col-12">
                <div className="title-heading text-center">
                  <h5 className="heading fw-semibold mb-0 sub-heading text-gray title-dark">
                    Job Vacancies
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="position-relative">
          <div className="shape overflow-hidden text-white">
            <svg
              viewBox="0 0 2880 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div>

        <section className="section">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-4 col-md-6 col-12">
                <div className="card bg-white p-4 rounded shadow sticky-bar search-bar">
                  <div>
                    <h6 className="mb-0">Search Properties</h6>

                    <div className="search-bar mt-2">
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
                    </div>
                  </div>
                  <div className="mt-4">
                    <h6>Location</h6>
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
                    </div>
                  </div>
                  <div className="mt-4">
                    <h6>Skills</h6>
                    <Multiselect
                      className={`skills-select shadow bg-white ${
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

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="nav-button"
                      onClick={() => handleSearch()}
                    >
                      Apply Filter
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-8 col-md-6 col-12">
                <div className="row g-4">
                  {jobsList.map((item, index) => {
                    return (
                      <div className="col-12" key={index} onClick={() => navigate(`/jobs/${item.id}`)}>
                        <Job item={item} />
                      </div>
                    );
                  })}
                </div>

                <div className="row">
                  <div className="col-12 mt-4 pt-2">
                    <nav aria-label="Page navigation">
                      <ul class="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                          <a class="page-link" href="#" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                          </a>
                        </li>
                        {renderPages()}
                        <li className={`page-item ${currentPage === pages && 'disabled'}`}>
                          <a class="page-link" href="#" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer top={true} />
        <ScrollTop />
      </>
    </>
  );
}
