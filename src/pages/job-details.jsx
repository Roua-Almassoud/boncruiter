import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import {
  FiMapPin,
  FiDollarSign,
  FiBriefcase,
  FiUser,
  FiCalendar,
} from '../assets/icons/vander.js';
import Footer from '../components/footer';
import ScrollTop from '../components/scrollTop';
import Loader from '../components/common/loader';
import Api from '../api/Api';

export default function JobDetails() {
  const { state } = useLocation();
  console.log('state: ', state);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState({});
  const [jobsList, setJobsList] = useState([]);

  const getJobInfo = async () => {
    const response = await Api.call({}, `/job/${id}`, 'get', '');
    if (response.data.code === '200') {
      let jobInfo = response.data.data;
      const currentDate = new Date();
      const postDate = new Date(jobInfo.createdAt);
      const differenceInTime = currentDate.getTime() - postDate.getTime();

      let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));
      jobInfo.createdAt = `${differenceInDays} days ago`;
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

  const jobApply = async () => {
    if (!localStorage.getItem('userId')) {
      navigate('/login');
    } else {
      setLoading(true);
      const response = await Api.call(
        { jobId: job.id },
        `/job/apply`,
        'post',
        ''
      );
      if (response.data.code === '200') {
        navigate('/jobs');
      }
    }
  };

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
                    {state ? (
                      <Link className="nav-button-border full">Applied</Link>
                    ) : (
                      <button
                        className={'nav-button-border'}
                        onClick={() => jobApply()}
                      >
                        Apply
                      </button>
                    )}
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
                  <ul className="list-style-three">
                    {job?.skills?.map((skill) => {
                      return <li>{skill.name}</li>;
                    })}
                  </ul>
                  <h4>{'Languages'}</h4>
                  <ul className="list-style-three">
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
                        <FiCalendar className="icon" />
                        <h5>Date Posted:</h5>
                        <span>{job?.createdAt}</span>
                      </li>
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
