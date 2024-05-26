import React, { useEffect, useState } from 'react';
//import _ from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from './loader.jsx';
import Utils from '../utils/utils.js';
//import moment from 'moment';
import Form from 'react-bootstrap/Form';

function FormCom({
  type,
  fields,
  backUrl = '',
  requestedId = '',
  componentStyle = {},
}) {
  let objectFields = {};
  const typeCapital = type
    ? `${type.charAt(0).toUpperCase()}${type.substring(1)}`
    : type;

  const formObject = fields
    ? fields.map((field) => {
        objectFields[field.name] = '';
      })
    : {};

  const { id, taskId, phaseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(objectFields);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [firstCall, setFirstCall] = useState(true);
  const [formFields, setFormFields] = useState(fields);
  const validate = (field = null) => {
    const pattern = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}/;
    const errorsObject = { ...errors };
    if (field) {
      let field_conf = fields.find((f) => f.name === field);
      if (typeof form[field] === 'object') {
        if (!Utils.isEmpty(form[field])) {
          delete errorsObject[field];
        }
      } else {
        if (
          String(form[field]).trim().length === 0 &&
          field_conf.optional === false
        ) {
          errorsObject[field] = t('Field is mandatory');
        } else {
          if (field === 'new_password') {
            let passwordValidation = Utils.checkPassword(form[field]);
            if (passwordValidation.length > 0) {
              errorsObject[field] = passwordValidation.map((error) => {
                return <p>{error}</p>;
              });
            } else {
              delete errorsObject[field];
            }
          } else if (field === 'confirmPassword') {
            if (form[field] !== form['new_password']) {
              errorsObject[field] = t(
                "Confirm password doesn't match New password"
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
          errorsObject[key] = t('Field is mandatory');
      });
    }

    const isErrorsEmpty = _.isEmpty(errorsObject);
    if (isErrorsEmpty && _.isNull(field)) {
      handleSubmit();
    }

    setErrors(errorsObject);
  };

  const updateForm = (field, value) => {
    if (field === 'shifts_number') {
      if (value === '3' && fields.length !== 5) {
        fields.push({
          name: 'team_c_name',
          type: 'text',
          optional: false,
          label: 'Team C Name',
        });
      } else if (value === '2' && fields.length === 5) {
        fields.pop();
        delete errors['team_c_name'];
      }
    }
    form[field] = value;
    validate(field);
    setForm({ ...form });
  };

  const renderInputs = (field) => {
    if (field) {
      let fieldInput = null;
      switch (field.type) {
        case 'text':
        case 'password':
          fieldInput = (
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">
                {field.label}
              </label>
              <input
                type="text"
                class="form-control"
                id="exampleFormControlInput1"
                placeholder="name@example.com"
              />
            </div>
          );
          // fieldInput = (
          //   <Input
          //     className={`${errors[field.name] ? 'contain-error' : ''}`}
          //     type={field.type}
          //     name={field.name}
          //     placeholder={`Enter ${field.label}`}
          //     value={form[field.name]}
          //     onChange={(e) => updateForm(field.name, e.target.value)}
          //   />
          // );
          break;
        case 'radio':
          fieldInput = (
            <RadioGroup
              data={field.data}
              value={form[field.name].toString()}
              onChange={(e) => updateForm(field.name, e.value)}
            />
          );
          break;
        case 'date-time':
          fieldInput = (
            <DateTimePicker
              format="yyyy-MM-dd HH:mm"
              style={{ width: '100%' }}
              value={
                form[field.name] && moment(form[field.name]).isValid()
                  ? new Date(
                      (moment.utc(form[field.name]).unix() +
                        new Date().getTimezoneOffset() * 60) *
                        1000
                    )
                  : null
              }
              onChange={(e) =>
                updateForm(
                  field.name,
                  new Date(
                    (moment.utc(e.target.value).unix() -
                      new Date().getTimezoneOffset() * 60) *
                      1000
                  )
                )
              }
            />
          );
          break;
        case 'list':
          fieldInput = (
            <DropDownList
              dataItemKey="id"
              textField="name"
              data={field.list}
              value={field.list.find((a) => a.id === form[field.name])}
              placeholder={'Select section ...'}
              onChange={(e) => updateForm(field.name, e.target.value.id)}
            />
          );
          break;

        case 'time':
          fieldInput = (
            <TimePicker
              className={'custom-time-input'}
              format="HH:mm:ss"
              value={
                typeof form[field.name] === 'string'
                  ? null
                  : new Date(form[field.name])
              }
              onChange={(e) => updateForm(field.name, e.target.value)}
            />
          );

          break;

        case 'check':
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
            {`${t(field.label)} ${field.optional ? '' : '*'}`}
          </Label>
          <div className={'k-form-field-wrap'}>
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
        margin: 'auto',
      };
  return (
    <>
      {loading && <Loader />}
      <Form
        onSubmit={validate}
        render={(formRenderProps) => (
          <FormElement style={style}>
            <fieldset className={'k-form-fieldset'}>
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
                  type={'submit'}
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

export default FormCom;
