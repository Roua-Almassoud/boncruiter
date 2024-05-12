import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import { FieldWrapper, Form, FormElement } from "@progress/kendo-react-form";
import { Label } from "@progress/kendo-react-labels";
import { Checkbox, Input, RadioGroup } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import Api from "../../../services/Api";
import Loader from "../../common/Loader";
import "./Form.scss";
import Utils from "../../../services/Utils.js";
import { DateTimePicker, TimePicker } from "@progress/kendo-react-dateinputs";
import moment from "moment";
import { DropDownList } from "@progress/kendo-react-dropdowns";

function FormComponent({
  type,
  fields,
  backUrl = "",
  requestedId = "",
  componentStyle = {},
}) {
  let objectFields = {};
  const typeCapital = type
    ? `${type.charAt(0).toUpperCase()}${type.substring(1)}`
    : type;

  const formObject = fields
    ? fields.map((field) => {
        objectFields[field.name] = "";
      })
    : {};

  const { id, taskId, phaseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(objectFields);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [firstCall, setFirstCall] = useState(true);
  const [formFields, setFormFields] = useState(fields);
  const validate = (field = null) => {
    const pattern = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}/;
    const errorsObject = { ...errors };
    if (field) {
      let field_conf = fields.find((f) => f.name === field);
      if (typeof form[field] === "object") {
        if (!Utils.isEmpty(form[field])) {
          delete errorsObject[field];
        }
      } else {
        if (
          String(form[field]).trim().length === 0 &&
          field_conf.optional === false
        ) {
          errorsObject[field] = t("Field is mandatory");
        } else {
          if (field === "new_password") {
            let passwordValidation = Utils.checkPassword(form[field]);
            if (passwordValidation.length > 0) {
              errorsObject[field] = passwordValidation.map((error) => {
                return <p>{error}</p>;
              });
            } else {
              delete errorsObject[field];
            }
          } else if (field === "confirmPassword") {
            if (form[field] !== form["new_password"]) {
              errorsObject[field] = t(
                "Confirm password doesn't match New password",
              );
            } else {
              delete errorsObject[field];
            }
          } else {
            delete errorsObject[field];
          }
        }
      }
    } else {
      Object.keys(form).forEach((key) => {
        let fieldData = fields.find((a) => a.name === key);

        if (
          String(form[key]).trim().length === 0 &&
          fieldData &&
          !fieldData.optional
        )
          errorsObject[key] = t("Field is mandatory");
      });
    }

    const isErrorsEmpty = _.isEmpty(errorsObject);
    if (isErrorsEmpty && _.isNull(field)) {
      handleSubmit();
    }

    setErrors(errorsObject);
  };

  const handleSubmit = () => {
    setLoading(true);
    if (type === "changePassword") {
      const apiName = `changePassword`;
      Api[apiName](
        form["old_password"],
        form["new_password"],
        (data) => {
          navigate(`/logout`);
          navigate(`/login`);
        },
        (error) => {
          setErrorMessage(error?.response?.data?.error_message);
        },
      );
    } else {
      if (id || requestedId) {
        let apiName = `update${typeCapital}`;
        if (type === "wellPhase") {
          form.task = taskId;
          form["end_date"] = Utils.isEmpty(form["end_date"])
            ? null
            : form["end_date"];
        }
        if (type === "subPhase") {
          form.phase = phaseId;
          form["end_date"] = Utils.isEmpty(form["end_date"])
            ? null
            : form["end_date"];
        }
        if (type === "workShift") {
          form.task = taskId;
          form["first_shift_start"] = moment(form["first_shift_start"]).format(
            "HH:mm:ss",
          );
          apiName = !form?.id ? `create${typeCapital}` : apiName;
        }
        Api[apiName](
          form,
          () => {
            if (type === "workShift") {
              location.reload();
            } else {
              navigate(`/${backUrl ? backUrl : type}`);
            }
          },
          () => {},
        );
      } else {
        if (type === "changePassword") {
          form["start_date"] = moment(form["start_date"]).format(
            "Y-MM-DD HH:mm",
          );
          form["end_date"] = moment(form["end_date"]).format("Y-MM-DD HH:mm");
        }
        if (type === "wellPhase") {
          form.task = taskId;
          form["end_date"] = Utils.isEmpty(form["end_date"])
            ? null
            : form["end_date"];
        }
        if (type === "subPhase") {
          form.phase = phaseId;
          form["end_date"] = Utils.isEmpty(form["end_date"])
            ? null
            : form["end_date"];
        }
        if (type === "workShift") {
          form.task = taskId;
          form["first_shift_start"] = moment(form["first_shift_start"]).format(
            "HH:mm:ss",
          );
        }
        const apiName = `create${typeCapital}`;
        Api[apiName](
          form,
          () => {
            if (type === "workShift") {
              location.reload();
            } else {
              navigate(`/${backUrl ? backUrl : type}`);
            }
          },
          () => {},
        );
      }
    }
    setLoading(false);
  };

  const updateForm = (field, value) => {
    if (field === "shifts_number") {
      if (value === "3" && fields.length !== 5) {
        fields.push({
          name: "team_c_name",
          type: "text",
          optional: false,
          label: "Team C Name",
        });
      } else if (value === "2" && fields.length === 5) {
        fields.pop();
        delete errors["team_c_name"];
      }
    }
    form[field] = value;
    validate(field);
    setForm({ ...form });
  };

  useEffect(() => {
    if (id || requestedId) {
      const apiName = `get${typeCapital}`;
      Api[apiName](type === "workShift" ? requestedId : id, (data) => {
        if (type === "wellPhase" || type === "subPhase") {
          if (data["section"]) {
            data["section"] = data["section"].id;
          }
        }
        if (type === "workShift") {
          let newDate = new Date();
          let exportedTime = data["first_shift_start"].split(":");
          newDate.setHours(exportedTime[0]);
          newDate.setMinutes(exportedTime[1]);
          newDate.setSeconds(exportedTime[2]);
          data["first_shift_start"] = newDate;
          fields =
            data["shifts_number"] === 3
              ? fields.push({
                  name: "team_c_name",
                  type: "text",
                  optional: false,
                  label: "Team C Name",
                })
              : fields;
        }
        setForm(data);
      });
    }

    setFirstCall(false);
    setLoading(false);
  }, []);

  const renderInputs = (field) => {
    if (field) {
      let fieldInput = null;
      switch (field.type) {
        case "text":
        case "password":
          fieldInput = (
            <Input
              className={`${errors[field.name] ? "contain-error" : ""}`}
              type={field.type}
              name={field.name}
              placeholder={`Enter ${field.label}`}
              value={form[field.name]}
              onChange={(e) => updateForm(field.name, e.target.value)}
            />
          );
          break;
        case "radio":
          fieldInput = (
            <RadioGroup
              data={field.data}
              value={form[field.name].toString()}
              onChange={(e) => updateForm(field.name, e.value)}
            />
          );
          break;
        case "date-time":
          fieldInput = (
            <DateTimePicker
              format="yyyy-MM-dd HH:mm"
              style={{ width: "100%" }}
              value={
                form[field.name] && moment(form[field.name]).isValid()
                  ? new Date(
                      (moment.utc(form[field.name]).unix() +
                        new Date().getTimezoneOffset() * 60) *
                        1000,
                    )
                  : null
              }
              onChange={(e) =>
                updateForm(
                  field.name,
                  new Date(
                    (moment.utc(e.target.value).unix() -
                      new Date().getTimezoneOffset() * 60) *
                      1000,
                  ),
                )
              }
            />
          );
          break;
        case "list":
          fieldInput = (
            <DropDownList
              dataItemKey="id"
              textField="name"
              data={field.list}
              value={field.list.find((a) => a.id === form[field.name])}
              placeholder={"Select section ..."}
              onChange={(e) => updateForm(field.name, e.target.value.id)}
            />
          );
          break;

        case "time":
          fieldInput = (
            <TimePicker
              className={"custom-time-input"}
              format="HH:mm:ss"
              value={
                typeof form[field.name] === "string"
                  ? null
                  : new Date(form[field.name])
              }
              onChange={(e) => updateForm(field.name, e.target.value)}
            />
          );

          break;

        case "check":
          fieldInput = (
            <Checkbox
              label={field.label}
              value={form[field.name]}
              onChange={(e) => updateForm(field.name, e.value)}
            />
          );
      }

      let returnedFieldWrapper = (
        <>
          <Label editorId={field.name} optional={field.optional}>
            {`${t(field.label)} ${field.optional ? "" : "*"}`}
          </Label>
          <div className={"k-form-field-wrap"}>
            {fieldInput}
            {errors[field.name] && (
              <span className="validation-error">{errors[field.name]}</span>
            )}
          </div>
        </>
      );
      return <FieldWrapper>{returnedFieldWrapper}</FieldWrapper>;
    }
  };

  const back = () => {
    navigate(`/${backUrl ? backUrl : type}`);
  };

  const style = !Utils.isEmptyObject(componentStyle)
    ? componentStyle
    : {
        maxWidth: 650,
        margin: "auto",
      };
  return (
    <>
      {loading && <Loader />}
      <Form
        onSubmit={validate}
        render={(formRenderProps) => (
          <FormElement style={style}>
            <fieldset className={"k-form-fieldset"}>
              {fields &&
                fields.map((field, index) => {
                  return renderInputs(field);
                })}
            </fieldset>
            {errorMessage && (
              <div className="alert alert-danger">{errorMessage}</div>
            )}
            <div className="k-form-buttons">
              <div className="save">
                <button
                  onClick={() => validate()}
                  type={"submit"}
                  className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                >
                  Submit
                </button>

                <Button
                  className="btn btn-success"
                  id="cancel"
                  onClick={() => back()}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </FormElement>
        )}
      />
    </>
  );
}

export default FormComponent;
