import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import _ from 'lodash';
import Utils from '../utils/utils';
import { PhoneInput } from 'react-international-phone';
import Multiselect from 'multiselect-react-dropdown';
import Select from 'react-dropdown-select';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';

function FormComponent({
  fields,
  formData,
  saveSection,
  next,
  userList,
  saveSectionForm,
  type = '',
}) {
  console.log('userList: ', userList);
  const [validated, setValidated] = useState(false);
  const [form, setForm] = useState(formData);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const phoneUtil = PhoneNumberUtil.getInstance();
  const isPhoneValid = (phone) => {
    if (phone)
      try {
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
      } catch (error) {
        return false;
      }
  };
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

      if (!Utils.isEmpty(field_conf?.regex)) {
        if (field_conf.regex === 'phone') {
          if (!isPhoneValid(form[field]))
            errorsObject[field] = `Invalid ${field_conf.label}`;
          else delete errorsObject[field];
        } else {
          if (!Utils.regexCheck(form[field], field_conf.regex))
            errorsObject[field] = `Invalid ${field_conf.label}`;
        }
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
      if (next) saveSection(form, selectedItems);
      else saveSectionForm(form);
    }

    setErrors(errorsObject);
    if (typeof event === 'object') {
      event?.preventDefault();
      event?.stopPropagation();
    }
  };

  const updateForm = (e, field, value, type = 'text') => {
    //form[field] = type === 'number' ? parseFloat(value) : value;
    form[field] = value;
    validate(e, field);
    setForm({ ...form });
  };

  const onSelect = (selectedList, selectedItem) => {
    setSelectedItems(selectedList);
  };

  const onRemove = (selectedList, removedItem) => {
    setSelectedItems(selectedList);
  };

  const changeList = (values, field) => {
    let value = values[0];
    if (field === 'language') {
      form.id = value.id;
      form.name = value.name;
      setForm({ ...form });
    } else {
      form[field] = value;
      setForm({ ...form });
    }
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
                value={form[field.name] ? form[field.name] : ''}
                // onChange={(value, country, event, formattedValue) =>
                //   updateForm(event, field.name, formattedValue)
                // }
                // onChange={(value) =>
                //   updateForm('', form[field.name], value)
                // }
                handlePhoneValueChange={(event, value) =>
                  updateForm(event, form[field.name], event.target.value)
                }
              />
            </div>
          );
          break;

        case 'multiSelect':
          fieldInput = (
            <div>
              <Multiselect
                options={field.options}
                selectedValues={userList}
                onSelect={onSelect}
                onRemove={onRemove}
                displayValue="name"
              />
            </div>
          );
          break;
        case 'list':
          fieldInput = (
            <div>
              <Select
                options={field.options}
                labelField={'name'}
                valueField="id"
                values={field.name === 'language' ? [form] : [form[field.name]]}
                onChange={(values) => changeList(values, field.name)}
              />
            </div>
          );
          break;

        case 'staticList':
          fieldInput = (
            <div>
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => updateForm(e, field.name, e.target.value)}
                value={form[field.name]}
              >
                <option>{field.firstItem}</option>
                {field.options?.map((option) => {
                  return <option value={option.value}>{option.name}</option>;
                })}
              </Form.Select>
            </div>
          );
          break;

        case 'radio':
          fieldInput = (
            <div>
              <Form.Check
                type={'checkbox'}
                label={field.label}
                onChange={(e) => updateForm(e, field.name, !form[field.name])}
                checked={form[field.name]}
              />
            </div>
          );
          break;
        case 'date':
          fieldInput = (
            <div>
              <DatePicker
                selected={form[field.name]}
                value={form[field.name]}
                onChange={(date, e) => updateForm(e, field.name, date)}
                format={'yyyy-MM-dd'}
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
      <div className="form-action">
        <button
          className={`${next ? 'nav-button' : 'underline-button'}`}
          onClick={(e) => validate(e)}
        >
          {`${type === 'new' ? 'Add' : 'Save'}`}
        </button>
        {next && (
          <button
            className={'nav-button-border'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              next();
            }}
          >
            Next
          </button>
        )}
      </div>
    </Form>
  );
}

export default FormComponent;
