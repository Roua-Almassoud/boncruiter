import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiMapPin, FiBookmark } from '../../assets/icons/vander';
import { useNavigate } from 'react-router-dom';
import Api from '../../api/Api';
function Job({ item, setLoading, getJobs }) {
  const navigate = useNavigate();
  const currentDate = new Date();
  const postDate = new Date(item.createdAt);
  const differenceInTime = currentDate.getTime() - postDate.getTime();
  let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));

  const jobApply = async () => {
    if (!localStorage.getItem('userId')) {
      navigate('/login');
    } else {
      setLoading(true);
      const response = await Api.call(
        { jobId: item.id },
        `/job/apply`,
        'post',
        ''
      );
      if (response.data.code === '200') {
        getJobs();
      }
    }
  };

  return (
    <div className="job-post job-post-list rounded shadow p-4 d-md-flex align-items-center justify-content-between position-relative">
      <div
        className="d-flex align-items-center w-250px"
        onClick={() => navigate(`/jobs/${item.id}`, { state: item.isApplied })}
      >
        {/* <img
          src={'src/assets/images/company/google-logo.png'}
          className="avatar avatar-small rounded shadow p-3 bg-white"
          alt=""
        /> */}

        <div className="ms-3">
          <Link
            //to={`/job-detail-one/${item.id}`}
            className="h5 title text-dark job-name"
          >
            {item.title}
          </Link>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between d-md-block mt-3 mt-md-0 w-100px">
        <span className="badge bg-soft-secondary rounded-pill">
          {/* {item.jobTime} */}
          Job type
        </span>
        <span className="text-muted d-flex align-items-center fw-medium mt-md-2 post-date">
          <FiClock className="fea icon-sm me-1 align-middle" />
          {differenceInDays} days ago
        </span>
      </div>

      <div className="d-flex align-items-center justify-content-between d-md-block mt-2 mt-md-0 w-130px">
        <span className="text-muted d-flex align-items-center">
          <FiMapPin className="fea icon-sm me-1 align-middle" />
          {item.location}
        </span>
        <span className="d-flex fw-medium mt-md-2">{item.salary}/mo</span>
      </div>

      <div className="mt-3 mt-md-0">
        {/*<Link
          to="#"
          className="btn btn-sm btn-icon btn-pills btn-soft-secondary bookmark"
        >
          <FiBookmark className="icons" />
        </Link>*/}
        {item.isApplied ? (
          <Link
            className="nav-button-border full"
          >
            Applied
          </Link>
        ) : (
          <button className={'nav-button-border'} onClick={() => jobApply()}>
            Apply
          </button>
        )}

        {/*<Link
          //to={`/job-detail-one/${item.id}`}
          className="btn btn-sm nav-button-border w-full ms-md-1"
          onClick={() => jobApply()}
        >
          Apply Now
        </Link>*/}
      </div>
    </div>
  );
}

export default Job;
