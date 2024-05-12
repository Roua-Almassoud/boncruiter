import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Api from '../api/Api';

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import ScrollTop from '../components/scrollTop';
import Loader from '../components/loader';
import Utils from '../components/utils/utils';

export default function UploadCV() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [alertError, setAlertError] = useState(null);

  const handleChange = (event) => {
    const reader = new FileReader();
    let selectedfile = event.target.files[0];
    console.log('selectedFile: ', selectedfile);
    setFile(selectedfile);
  };

  const fileOperation = async (operation) => {
    if (operation === 'upload') {
      setLoading(true);
      let formData = new FormData();
      formData.append('file', file);
      const response = await Api.call(formData, `/files/upload_cv`, 'post', '', true);
      
      const cvData = response.data
      console.log('cvData: ', cvData, 'cvData.code === 200: ', cvData.code === 200);
      if (cvData.code === '200') {
        console.log('inn response')
        //setLoading(false);
        navigate('/profile');
      } else {
        console.log('in error');
        setLoading(false);
        setAlertError('Something went wrong, please try again!');
      }
    } else {
      setFile(null);
    }
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
            <div class="dashboard-outer">
              <div class="upper-title-box">
                <h3>CV Manager!</h3>
                <div class="text">Ready to jump back in?</div>
              </div>

              <div class="row">
                <div class="col-lg-12">
                  <div class="cv-manager-widget ls-widget">
                    <div class="widget-title">
                      <h4>Cv Manager</h4>
                    </div>
                    <div class="widget-content">
                      <div class="uploading-resume">
                        <div class="uploadButton">
                          <input
                            class="uploadButton-input"
                            //accept=".doc,.docx,.xml,application/msword,application/pdf, image/*"
                            accept="application/pdf"
                            id="upload"
                            multiple=""
                            type="file"
                            name="attachments[]"
                            onChange={(event) => handleChange(event)}
                          />
                          <label class="cv-uploadButton" for="upload">
                            <span class="title">Drop files here to upload</span>
                            <span class="text">
                              To upload file size is (Max 5Mb) and allowed file
                              types are (.doc, .docx, .pdf)
                            </span>
                            <span class="theme-btn btn-style-one nav-button">
                              Upload Resume
                            </span>
                          </label>
                          <span class="uploadButton-file-name"></span>
                        </div>
                      </div>
                      {!Utils.isEmpty(file) && (
                        <div class="files-outer">
                          <div class="file-edit-box">
                            <span class="title">{file?.name}</span>
                            <div class="edit-btns">
                              <button onClick={() => fileOperation('upload')}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  class="bi bi-upload"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                                  <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
                                </svg>
                              </button>
                              <button onClick={() => fileOperation('delete')}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  class="bi bi-trash"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {alertError && (
          <div class="alert alert-danger" role="alert">
            {alertError}
          </div>
        )}
        </section>
        
        <Footer />
        <ScrollTop />
      </>
    </>
  );
}
