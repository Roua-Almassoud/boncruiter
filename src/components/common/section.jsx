import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import FormComponent from './formComponent';
import Api from '../../api/Api';
import Loader from './loader';
import Utils from '../utils/utils';

export default function Section(props) {
  const { section, sectionData, loading, changeSection, next } = props;

  const saveSection = async (data) => {
    loading(true);
    const response = await Api.call(
      data,
      `/user/${section === 'basicInfo' ? 'basic-info' : section}`,
      'post',
      ''
    );
    if (response.data) {
      loading(false);
    } else {
      loading(false);
    }
  };

  const renderSection = () => {
    let fields = [];
    let form = {};
    switch (section) {
      case 'basicInfo':
        form = {
          brief: sectionData.brief,
          github: sectionData.github,
          portfolioUrl: sectionData.portfolioUrl,
          birthDate: sectionData.birthDate,
          noticePeriod: sectionData.noticePeriod,
          desiredSalary: sectionData.desiredSalary,
        };
        fields = [
          {
            name: 'email',
            type: 'text',
            optional: false,
            label: 'Email',
          },
          {
            name: 'firstName',
            type: 'text',
            optional: false,
            label: 'First Name',
          },
          {
            name: 'lastName',
            type: 'text',
            optional: false,
            label: 'Last Name',
          },
          {
            name: 'birthDate',
            type: 'text',
            optional: false,
            label: 'Birth Date',
            regex: 'date',
          },
          {
            name: 'phoneNumber',
            type: 'phone',
            optional: true,
            label: 'Phone Number',
            regex: 'phone',
          },
          {
            name: 'brief',
            type: 'text',
            optional: false,
            label: 'Brief',
          },

          {
            name: 'githubMainPageUrl',
            type: 'text',
            optional: false,
            label: 'Github Main Page Url',
          },

          {
            name: 'linkedinUrl',
            type: 'text',
            optional: false,
            label: 'Linkedin Url',
          },
          {
            name: 'location',
            type: 'text',
            optional: false,
            label: 'Location',
          },
          {
            name: 'portfolioWebsiteUrl',
            type: 'text',
            optional: false,
            label: 'Portfolio Website Url',
          },
          {
            name: 'noticePeriod',
            type: 'number',
            optional: false,
            label: 'Notice Period',
          },
          {
            name: 'desiredSalary',
            type: 'number',
            optional: false,
            label: 'Desired Salary',
          },
        ];

        break;
      case 'certificates':
        break;
      case 'education':
        break;
      case 'experiences':
        break;
      case 'languages':
        break;
      case 'projects':
        break;
      case 'skills':
        break;
    }
    return (
      <FormComponent
        fields={fields}
        formData={sectionData}
        saveSection={saveSection}
        next={next}
      />
    );
  };

  return <div className="container">{renderSection()}</div>;
}
