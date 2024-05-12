import React from 'react';
import { Link } from "react-router-dom";

import bg1 from "../assets/images/bg2.png"
import hero1 from '../assets/images/hero1.png'
import company1 from '../assets/images/company/circle-logo.png'
import company2 from '../assets/images/company/facebook-logo.png'
import company3 from '../assets/images/company/google-logo.png'
import company4 from '../assets/images/company/lenovo-logo.png'
import company5 from '../assets/images/company/android.png'
import company6 from '../assets/images/company/linkedin.png'
import company7 from '../assets/images/company/skype.png'
import company8 from '../assets/images/company/snapchat.png'

import Navbar from '../components/navbar';
import Footer from '../components/footer';
// import AboutUs from "../componants/aboutUs";
// import Categories from "../componants/categories";
// import Blog from '../componants/blog';
// import Footer from '../componants/footer';
// import Companies from '../componants/companies';
// import AboutTwo from '../componants/aboutTwo';
import ScrollTop from '../components/scrollTop';

import { jobData } from "../data/data";

import {FiSearch,FiClock,FiMapPin} from "../assets/icons/vander"

export default function Index(){
    return(
        <>
        <Navbar navClass="defaultscroll sticky"/>
        <section className="bg-half-170 d-table w-100 bg-container" 
        // style={{backgroundImage:`url(${bg1})`, backgroundPosition:'center'}}
        >
            <div className="container">
                <div className="row g-4 align-items-center">
                    <div className="col-md-6">
                        <div className="title-heading">
                            <h1 className="heading fw-bold">Get hired <br/> by the popular <br/> candidates.</h1>
                            <p className="para-desc  mb-0">Find Jobs, Employment & Career Opportunities. Some of the companies we've helped recruit excellent applicants over the years.</p>

                            <div className="text-center subscribe-form mt-4">
                                <form style={{maxWidth:'800px'}}>
                                    <div className="mb-0">
                                        <div className="position-relative">
                                            <FiSearch className="fea icon-20 position-absolute top-50 start-0 translate-middle-y ms-3"/>
                                            <input type="text" id="help" name="name" className="shadow rounded-pill bg-white ps-5" required="" placeholder="Search jobs & candidates ..."/>
                                        </div>
                                        <button type="submit" className="nav-button">Search</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="position-relative ms-lg-5">
                            {/* <img src={hero1} className="img-fluid p-5" alt=""/> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* <section className="section">
            <AboutUs containerClass="container"/>
            <Categories/>

            <div className="container mt-100 mt-60">
                <div className="row align-items-end mb-4 pb-2">
                    <div className="col-lg-6 col-md-9">
                        <div className="section-title text-md-start text-center">
                            <h4 className="title mb-3">Explore Jobs</h4>
                            <p className="text-muted para-desc mb-0">Search all the open positions on the web. Get your own personalized salary estimate. Read reviews on over 30000+ companies worldwide.</p>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-3 d-none d-md-block">
                        <div className="text-md-end">
                            <Link to="/job-grid-one" className="btn btn-link primary text-muted">See More Jobs <i className="mdi mdi-arrow-right"></i></Link>
                        </div>
                    </div>
                </div>

                <div className="row g-4 mt-0">
                    {jobData.slice(0,6).map((item,index)=>{
                        return(
                            <div className="col-lg-4 col-md-6 col-12" key={index}>
                                <div className="job-post rounded shadow p-4">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <img src={item.image} className="avatar avatar-small rounded shadow p-3 bg-white" alt=""/>
            
                                            <div className="ms-3">
                                                <Link to="/employer-profile" className="h5 company text-dark">{item.name}</Link>
                                                <span className="text-muted d-flex align-items-center small mt-2"><FiClock  className="fea icon-sm me-1"/> {item.posted} days ago</span>
                                            </div>
                                        </div>

                                        <span className="badge bg-soft-primary">{item.jobTime}</span>
                                    </div>

                                    <div className="mt-4">
                                        <Link to={`/job-detail-one/${item.id}`} className="text-dark title h5">{item.title}</Link>

                                        <span className="text-muted d-flex align-items-center mt-2"><FiMapPin className="fea icon-sm me-1"/>{item.country}</span>

                                        <div className="progress-box mt-3">
                                            <div className="progress mb-2">
                                                <div className="progress-bar position-relative bg-primary" style={{width:'50%'}}></div>
                                            </div>

                                            <span className="text-dark">{item.applied} applied of <span className="text-muted">{item.vacancy} vacancy</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    <div className="col-12 d-md-none d-block">
                        <div className="text-center">
                            <Link to="/job-grid-one" className="btn btn-link primary text-muted">See More Jobs <i className="mdi mdi-arrow-right"></i></Link>
                        </div>
                    </div>
                </div>
            </div>

            <AboutTwo/>

            <div className="container mt-100 mt-60">
                <Companies/>
            </div>

            <div className="container mt-100 mt-60">
                <div className="row justify-content-center">
                    <div className="col">
                        <div className="section-title text-center mb-4 pb-2">
                            <h4 className="title mb-3">Latest Blog or News</h4>
                            <p className="text-muted para-desc mb-0 mx-auto">Search all the open positions on the web. Get your own personalized salary estimate. Read reviews on over 30000+ companies worldwide.</p>
                        </div>
                    </div>
                </div>

                <Blog/>
            </div>
        </section> */}
        <Footer/>
        <ScrollTop/>
        </>
    )
}