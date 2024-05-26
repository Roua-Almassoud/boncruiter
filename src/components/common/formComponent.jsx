import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import _ from 'lodash';
import Utils from '../utils/utils';
import PhoneInput from 'react-phone-input-2';

function FormComponent({ fields, formData, saveSection, next }) {
  const [validated, setValidated] = useState(false);
  const [form, setForm] = useState(formData);

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  const validate = (event, field = null) => {
    const errorsObject = { ...errors };
    if (field) {
      let field_conf = fields.find((f) => f.name === field);
      if (!Utils.isEmpty(field_conf.regex)) {
        if (!Utils.regexCheck(form[field], field_conf.regex))
          errorsObject[field] = `Invalid ${field_conf.label}`;
        else delete errorsObject[field];
      } else if (typeof form[field] === 'object') {
        if (!Utils.isEmpty(form[field])) {
          delete errorsObject[field];
        }
      } else {
        if (Utils.isEmpty(form[field]) && field_conf.optional === false) {
          errorsObject[field] = `${field_conf.label} is mandatory`;
        } else delete errorsObject[field];
      }
    } else {
      Object.keys(form).forEach((key) => {
        let fieldData = fields.find((a) => a.name === key);
        if (Utils.isEmpty(form[key]) && fieldData && !fieldData.optional)
          errorsObject[key] = `${fieldData.label} is mandatory`;
      });
    }
    const isErrorsEmpty = _.isEmpty(errorsObject);
    if (isErrorsEmpty && _.isNull(field)) {
      setValidated(true);
      saveSection(form);
    }

    setErrors(errorsObject);
    if (typeof event === 'object') {
      event?.preventDefault();
      event?.stopPropagation();
    }
  };

  const updateForm = (e, field, value, type = 'text') => {
    form[field] = type === 'number' ? parseFloat(value) : value;
    validate(e, field);
    setForm({ ...form });
  };

  const renderInputs = (field) => {
    if (field) {
      let fieldInput = null;
      switch (field.type) {
        case 'text':
        case 'password':
        case 'number':
          fieldInput = (
            <div>
              <Form.Control
                type={field.type}
                placeholder=""
                value={form[field.name]}
                onChange={(e) =>
                  updateForm(e, field.name, e.target.value, field.type)
                }
              />
            </div>
          );
          break;

        case 'phone':
          fieldInput = (
            <div>
              <PhoneInput
                className="number"
                country={'us'}
                value={form[field.name]}
                onChange={(e) => updateForm(e, field.name, e)}
              />
            </div>
          );
          break;
      }

      let returnedFieldWrapper = (
        <div className="mb-4">
          <Form.Label>
            {`${field.label} ${field.optional ? '' : '*'}`}
          </Form.Label>
          <div className={'k-form-field-wrap'}>
            {fieldInput}
            {errors[field.name] && (
              <Form.Control.Feedback type="invalid" className="mb-3">
                {errors[field.name]}
              </Form.Control.Feedback>
            )}
          </div>
        </div>
      );
      return <Form.Group>{returnedFieldWrapper}</Form.Group>;
    }
  };
  return (
    <Form onSubmit={validate}>
      {fields &&
        fields.map((field, index) => {
          return renderInputs(field);
        })}
      <button className={'nav-button'} onClick={(e) => validate(e)}>
        Save
      </button>
      
    </Form>
  );
}

export default FormComponent;
