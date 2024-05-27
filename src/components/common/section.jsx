import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import FormComponent from './formComponent';
import Api from '../../api/Api';
import Loader from './loader';
import Utils from '../utils/utils';

export default function Section(props) {
  const { section, sectionData, loading, next, availableSkills } = props;
  const [alertError, setAlertError] = useState('');
  const saveSection = async (data, selectedList) => {
    loading(true);
    let listData = [];
    if (section === 'skills') {
      selectedList.map((item) => {
        listData.push({ skillId: item.id });
      });
    }

    let requestBody =
      section === 'skills'
        ? {
            skills: listData,
          }
        : data;
    const response = await Api.call(
      requestBody,
      `/user/${
        section === 'basicInfo'
          ? 'basic-info'
          : section === 'skills'
          ? 'skill/bulk'
          : section
      }`,
      `${section === 'skills' ? 'put' : 'post'}`,
      ''
    );
    if (response.data.code === '200') {
      loading(false);
      setAlertError('');
      next();
    } else {
      loading(false);
      setAlertError(
        response.data.message || 'Something went wrong, please try again!'
      );
    }
  };

  const renderSection = () => {
    let fields = [];
    let form;
    switch (section) {
      case 'basicInfo':
        form = {
          ...sectionData,
          noticePeriod: sectionData?.noticePeriod,
          desiredSalary: sectionData?.desiredSalary,
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
            name: 'github',
            type: 'text',
            optional: false,
            label: 'Github Main Page Url',
            regex: 'uri',
          },

          {
            name: 'linkedinUrl',
            type: 'text',
            optional: false,
            label: 'Linkedin Url',
            regex: 'uri',
          },
          {
            name: 'location',
            type: 'text',
            optional: false,
            label: 'Location',
          },
          {
            name: 'portfolioUrl',
            type: 'text',
            optional: false,
            label: 'Portfolio Website Url',
            regex: 'uri',
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
      case 'skills':
        form = [...sectionData];
        fields = [
          {
            name: 'skills',
            type: 'multiSelect',
            optional: false,
            label: 'Skills',
            options: availableSkills,
          },
        ];
        if (alertError) {
          setAlertError('');
        }
        break;
      case 'languages':
        break;
      case 'education':
        break;
      case 'certificates':
        break;
      case 'projects':
        break;
      case 'experiences':
        break;
    }
    return (
      <>
        <FormComponent
          fields={fields}
          formData={form}
          saveSection={saveSection}
          next={next}
          userList={section === 'skills' ? sectionData : null}
        />
        {alertError && (
          <div class="alert alert-danger profile-alert" role="alert">
            {alertError}
          </div>
        )}
      </>
    );
  };

  return <div className="container">{renderSection()}</div>;
}
