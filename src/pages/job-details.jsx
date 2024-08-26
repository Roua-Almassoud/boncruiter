import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar';
import {
  FiMapPin,
  FiDollarSign,
  FiBriefcase,
  FiUser,
} from '../assets/icons/vander.js';
import Footer from '../components/footer';
import ScrollTop from '../components/scrollTop';
import Loader from '../components/common/loader';
import Api from '../api/Api';

export default function JobDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState({});
  const [jobsList, setJobsList] = useState([]);

  const getJobInfo = async () => {
    const response = await Api.call({}, `/job/${id}`, 'get', '');
    if (response.data.code === '200') {
      let jobInfo = response.data.data;
      console.log('jobInfo: ', jobInfo);
      setJob(jobInfo);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobInfo();
  }, []);

  console.log('job: ', job);

  return (
    <>
      {loading && <Loader />}
      <>
        <Navbar navClass="defaultscroll sticky" />
        <section className="bg-half-170 d-table w-100 bg-container jobs-list details">
          <div className="container">
            <div className="row mt-5 justify-content-center">
              <div className="col-12">
                <div className="title-heading text-left">
                  <h4>{job?.title}</h4>
                  <div className="header-details">
                    <ul className="ul-jobs">
                      <li>
                        <FiBriefcase className="fea icon-20 position-absolute top-50 end-0 translate-middle-y mx-4" />
                        <span>{job?.Company?.name}</span>
                      </li>
                      <li>
                        <FiMapPin className="fea icon-20 position-absolute top-50 end-0 translate-middle-y mx-4" />
                        <span>{job?.Company?.address}</span>
                      </li>
                      <li>
                        <FiDollarSign className="fea icon-20 position-absolute top-50 end-0 translate-middle-y mx-4" />
                        <span>{`${
                          job?.salary
                            ? job?.salary
                            : `$${job?.salaryMin} - $${job?.salaryMax}`
                        } `}</span>
                      </li>
                    </ul>
                    <button className={'nav-button-border'}>Apply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-8 col-md-6 col-12">
                <div className="job-detail">
                  <h4>Job Description</h4>
                  <p>{job?.description}</p>
                  <h4>{'Skill & Experience'}</h4>
                  <ul className='list-style-three'>
                    {job?.skills?.map((skill) => {
                     return <li>{skill.name}</li>;
                    })}
                  </ul>
                  <h4>{'Languages'}</h4>
                  <ul className='list-style-three'>
                    {job?.languages?.map((language) => {
                     return <li>{language.name}</li>;
                    })}
                  </ul>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-12">
                <div className="job-sidebar">
                  <h4 className="title">Job Overview</h4>
                  <div className="content">
                    <ul className="job-overview">
                      <li>
                        <FiMapPin className="icon" />
                        <h5>Location:</h5>
                        <span>{job?.Company?.address}</span>
                      </li>
                      <li>
                        <FiUser className="icon" />
                        <h5>Job Title:</h5>
                        <span>{job?.title}</span>
                      </li>
                      <li>
                        <FiDollarSign className="icon" />
                        <h5>Salary:</h5>
                        <span>{`${
                          job?.salary
                            ? job?.salary
                            : `$${job?.salaryMin} - $${job?.salaryMax}`
                        } `}</span>
                      </li>
                    </ul>
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
