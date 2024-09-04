import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FormComponent from "./formComponent";
import Api from "../../api/Api";
import Loader from "./loader";
import Utils from "../utils/utils";
import { FiPlusCircle, LuPen, FiTrash } from "../../assets/icons/vander";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import { yearList, monthList } from "./staticData";

export default function Section(props) {
  const {
    section,
    sectionData,
    loading,
    next,
    availableSkills,
    languages,
    alertError,
    setAlertError,
  } = props;

  const [formMode, setFormMode] = useState("");
  const [selectedForm, setSelectedForm] = useState({});
  const [sectionFormData, setSectionFormData] = useState(sectionData);
  const languageFields = [
    {
      name: "language",
      type: "list",
      optional: false,
      label: "Languages",
      options: languages,
    },
    {
      name: "level",
      type: "list",
      optional: false,
      label: "Levels",
      options: [
        {
          id: "none",
          name: "None",
        },
        {
          id: "elementary",
          name: "Elementary",
        },
        {
          id: "limited",
          name: "Limited",
        },
        {
          id: "professional",
          name: "Professional",
        },
        {
          id: "bilingual",
          name: "Bilingual",
        },
        {
          id: "native",
          name: "Native",
        },
      ],
    },
  ];
  const educationFields = [
    {
      name: "degree",
      type: "text",
      optional: false,
      label: "Degree",
    },
    {
      name: "institution",
      type: "text",
      optional: false,
      label: "Institution",
    },
    {
      name: "brief",
      type: "text",
      optional: false,
      label: "Brief",
    },
    {
      name: "fromYear",
      type: "staticList",
      optional: false,
      label: "From Year",
      firstItem: "Year",
      options: yearList,
    },
    {
      name: "toYear",
      type: "staticList",
      optional: false,
      label: "To Year",
      firstItem: "Year",
      options: yearList,
    },
  ];
  const certificateFields = [
    {
      name: "title",
      type: "text",
      optional: false,
      label: "Title",
    },
    {
      name: "link",
      type: "text",
      optional: false,
      label: "Link",
      regex: "uri",
    },
    {
      name: "institution",
      type: "text",
      optional: false,
      label: "Institution",
    },
    {
      name: "brief",
      type: "text",
      optional: false,
      label: "Brief",
    },
    {
      name: "year",
      type: "staticList",
      optional: false,
      label: "Year",
      firstItem: "Year",
      options: yearList,
    },
  ];

  const experienceFields = [
    {
      name: "title",
      type: "text",
      optional: false,
      label: "Title",
    },
    {
      name: "company",
      type: "text",
      optional: false,
      label: "Company",
    },
    {
      name: "summary",
      type: "text",
      optional: false,
      label: "Summary",
    },
    {
      name: "location",
      type: "text",
      optional: false,
      label: "Location",
    },
    // {
    //   name: 'remote',
    //   type: 'radio',
    //   optional: false,
    //   label: 'Remote',
    // },
    // {
    //   name: 'fullTime',
    //   type: 'radio',
    //   optional: false,
    //   label: 'Full-time',
    // },
    {
      name: "startMonth",
      type: "staticList",
      optional: false,
      label: "Start Month",
      firstItem: "Month",
      options: monthList,
    },
    {
      name: "startYear",
      type: "staticList",
      optional: false,
      label: "Start Year",
      firstItem: "Year",
      options: yearList,
    },
    {
      name: "endMonth",
      type: "staticList",
      optional: false,
      label: "End Month",
      firstItem: "Month",
      options: monthList,
    },
    {
      name: "endYear",
      type: "staticList",
      optional: false,
      label: "End Year",
      firstItem: "Year",
      options: yearList,
    },
  ];
  const saveSection = async (data, selectedList) => {
    loading(true);
    let listData = [];
    if (section === "skills") {
      selectedList.map((item) => {
        listData.push({ skillId: item.id });
      });
    }
    if (section === "languages") {
      data.map((item) => {
        listData.push({
          languageId: item.id,
          level: item.level?.id,
        });
      });
    }
    if (section === "education") {
      data.map((item) => {
        listData.push({
          degree: item.degree,
          institution: item.institution,
          brief: item.brief,
          fromYear: item.fromYear,
          toYear: item.toYear,
        });
      });
    }
    if (section === "certificates") {
      data.map((item) => {
        listData.push({
          title: item.title,
          link: item.link,
          institution: item.institution,
          brief: item.brief,
          year: item.year,
        });
      });
    }
    if (section === "experiences") {
      data.map((item) => {
        listData.push({
          title: item.title,
          company: item.company,
          summary: item.summary,
          location: item.location,
          remote: false,
          fullTime: false,
          startMonth: parseInt(item.startMonth),
          startYear: parseInt(item.startYear),
          endMonth: parseInt(item.endMonth),
          endYear: parseInt(item.endYear),
        });
      });
    }

    let requestBody =
      section !== "basicInfo"
        ? {
            [section]: listData,
          }
        : data;
    let requestPath =
      section === "basicInfo"
        ? "basic-info"
        : section === "skills"
        ? "skill/bulk"
        : section === "languages"
        ? "language/bulk"
        : section === "education"
        ? "education/bulk"
        : section === "certificates"
        ? "certificate/bulk"
        : section === "experiences"
        ? "experience/bulk"
        : section;
    const response = await Api.call(
      requestBody,
      `/user/${requestPath}`,
      `${section !== "basicInfo" ? "put" : "post"}`,
      "",
    );
    if (response.data.code === "200") {
      loading(false);
      setAlertError("");
      if (section !== "experiences") next();
    } else {
      const errorMsg = response.data
        ? response.data[0]
          ? response.data[0].field + " " + response.data[0].message
          : "Something went wrong, please try again!"
        : "Something went wrong, please try again!";
      setAlertError(errorMsg);
      loading(false);
    }
  };

  const saveSectionForm = (data) => {
    if (formMode === "new") {
      sectionFormData.push(data);
      setSectionFormData(sectionFormData);
      setFormMode("");
      renderSection();
    } else {
      let updatedData = sectionFormData?.map((item) => {
        if (item.tempId === selectedForm.tempId) {
          return data;
        } else return item;
      });
      let selectedObject = updatedData.find(
        (a) => a.tempId === selectedForm.tempId,
      );

      selectedObject = { ...data };

      setSectionFormData(updatedData);
    }
  };
  const editForm = (selectedItem) => {
    setSelectedForm(selectedItem);
    setFormMode("edit");
  };
  const renderItem = (item) => {
    let itemData;
    switch (section) {
      case "languages":
        if (formMode === "edit" && item.id === selectedForm.id) {
          itemData = (
            <FormComponent
              fields={languageFields}
              formData={selectedForm}
              saveSection={saveSection}
              next={null}
              userList={null}
              saveSectionForm={saveSectionForm}
            />
          );
        } else {
          itemData = (
            <div className="data">
              <p>{item.name}</p>
              <p>Level</p>
            </div>
          );
        }
        break;

      case "education":
        if (formMode === "edit" && item.id === selectedForm.id) {
          itemData = (
            <FormComponent
              fields={educationFields}
              formData={selectedForm}
              saveSection={saveSection}
              next={null}
              userList={null}
              saveSectionForm={saveSectionForm}
            />
          );
        } else {
          itemData = (
            <div className="data">
              <p>{item.institution}</p>
              <p>{item.degree}</p>
              <p>{`${item.fromYear} - ${item.toYear || "PRESENT"}`}</p>
              <p>{item.brief}</p>
            </div>
          );
        }
        break;

      case "certificates":
        if (formMode === "edit" && item.id === selectedForm.id) {
          itemData = (
            <FormComponent
              fields={certificateFields}
              formData={selectedForm}
              saveSection={saveSection}
              next={null}
              userList={null}
              saveSectionForm={saveSectionForm}
            />
          );
        } else {
          itemData = (
            <div className="data">
              <p>{item.title}</p>
              <p>{item.institution}</p>
              <p>{item.brief}</p>
              <p>{item.link}</p>
              <p>{item.year}</p>
            </div>
          );
        }
        break;

      case "experiences":
        if (formMode === "edit" && item.id === selectedForm.id) {
          itemData = (
            <FormComponent
              fields={experienceFields}
              formData={selectedForm}
              saveSection={saveSection}
              next={null}
              userList={null}
              saveSectionForm={saveSectionForm}
            />
          );
        } else {
          itemData = (
            <div className="data">
              <p>{item.title}</p>
              <p>{`${item.company} - ${
                item.fullTime ? "Full-time" : "Part-time"
              }`}</p>
              <p>{`(${item.startMonth} / ${item.startYear}) - (${item.endMonth} / ${item.endYear})`}</p>
            </div>
          );
        }
        break;
    }
    return itemData;
  };

  const addForm = () => {
    setFormMode("new");
  };

  const renderListMode = () => {
    let list = [];
    sectionFormData &&
      sectionFormData.map((item) => {
        list.push(
          <ListGroup.Item className="data-list">
            <div className="row">
              <div className="col-10">{renderItem(item)}</div>

              <div className="col-2 action-section">
                <LuPen className="fea icon" onClick={() => editForm(item)} />
                <FiTrash className="fea icon" />
              </div>
            </div>
          </ListGroup.Item>,
        );
      });

    return <ListGroup>{list}</ListGroup>;
  };

  const renderForm = () => {
    let fields =
      section === "languages"
        ? languageFields
        : section === "education"
        ? educationFields
        : section === "certificates"
        ? certificateFields
        : section === "experiences"
        ? experienceFields
        : [];
    let formFields =
      section === "languages"
        ? {
            id: "",
            name: "",
            level: {
              id: "none",
              name: "None",
            },
            tempId: Utils.unique(),
          }
        : section === "education"
        ? {
            degree: "",
            institution: "",
            brief: "",
            fromYear: 0,
            toYear: 0,
          }
        : section === "certificates"
        ? {
            title: "",
            link: "",
            institution: "",
            brief: "",
            year: 0,
          }
        : section === "experiences"
        ? {
            title: "",
            company: "",
            summary: "",
            location: "",
            remote: false,
            fullTime: false,
            startMonth: "",
            startYear: "",
            endMonth: "",
            endYear: "",
          }
        : {};
    let addedForm = (
      <Card>
        <Card.Body>
          <FormComponent
            fields={fields}
            formData={formFields}
            saveSection={saveSection}
            next={null}
            userList={null}
            saveSectionForm={saveSectionForm}
            type={"new"}
          />
        </Card.Body>
      </Card>
    );
    return <>{addedForm}</>;
  };

  const renderSection = () => {
    let fields = [];
    let form;
    let extraAction;
    switch (section) {
      case "basicInfo":
        form = {
          ...sectionData,
          brief: sectionData?.brief,
          github: sectionData?.github,
          portfolioUrl: sectionData?.portfolioUrl,
          birthDate: sectionData?.birthDate,
          phoneNumber: sectionData?.phoneNumber,
          location: sectionData?.location,
          linkedinUrl: sectionData?.linkedinUrl,
          noticePeriod: sectionData?.noticePeriod,
          desiredSalary: sectionData?.desiredSalary,
        };
        fields = [
          {
            name: "email",
            type: "text",
            optional: false,
            label: "Email",
          },
          {
            name: "firstName",
            type: "text",
            optional: false,
            label: "First Name",
          },
          {
            name: "lastName",
            type: "text",
            optional: false,
            label: "Last Name",
          },
          {
            name: "birthDate",
            type: "date",
            optional: false,
            label: "Birth Date",
          },
          // {
          //   name: 'phoneNumber',
          //   type: 'phone',
          //   optional: true,
          //   label: 'Phone Number',
          //   regex: 'phone',
          // },
          {
            name: "brief",
            type: "text",
            optional: false,
            label: "Brief",
          },

          {
            name: "github",
            type: "text",
            optional: true,
            label: "Github Main Page Url",
            regex: "uri",
          },

          {
            name: "linkedinUrl",
            type: "text",
            optional: false,
            label: "Linkedin Url",
            regex: "uri",
          },
          {
            name: "location",
            type: "text",
            optional: false,
            label: "Location",
          },
          {
            name: "portfolioUrl",
            type: "text",
            optional: true,
            label: "Portfolio Website Url",
            regex: "uri",
          },
          {
            name: "noticePeriod",
            type: "number",
            optional: false,
            label: "Notice Period",
          },
          {
            name: "desiredSalary",
            type: "number",
            optional: false,
            label: "Desired Salary",
          },
        ];

        break;
      case "skills":
        form = [...sectionData];
        fields = [
          {
            name: "skills",
            type: "multiSelect",
            optional: false,
            label: "Skills",
            options: availableSkills,
          },
        ];
        if (alertError) {
          setAlertError("");
        }
        break;
      case "languages":
        extraAction = <i class="bi bi-plus"></i>;
        break;
      case "education":
        extraAction = <i class="bi bi-plus"></i>;
        break;
      case "certificates":
        extraAction = <i class="bi bi-plus"></i>;
        break;
      case "projects":
        break;
      case "experiences":
        extraAction = <i class="bi bi-plus"></i>;
        break;
    }

    return (
      <>
        {extraAction && (
          <div className="add-section">
            <FiPlusCircle
              className="plus fea icon-md m-2"
              onClick={() => addForm()}
            />
          </div>
        )}

        {formMode === "new" && renderForm()}
        {section !== "basicInfo" && section !== "skills" ? (
          renderListMode()
        ) : (
          <FormComponent
            fields={fields}
            formData={form}
            saveSection={saveSection}
            next={next}
            userList={section === "skills" ? sectionData : null}
          />
        )}
        {section !== "basicInfo" && section !== "skills" && (
          <div className="form-action">
            <button
              className={`nav-button`}
              onClick={() => saveSection(sectionFormData)}
            >
              {`Save`}
            </button>

            <button
              className={"nav-button-border"}
              onClick={(e) => {
                next();
              }}
            >
              Next
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="container">
      {renderSection()}
      {alertError.length > 0 && (
        <div className="alert alert-danger profile-alert" role="alert">
          {alertError}
        </div>
      )}
    </div>
  );
}
