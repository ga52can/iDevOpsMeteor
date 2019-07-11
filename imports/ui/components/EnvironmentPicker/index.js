import React from 'react';
import PropTypes from 'prop-types';

const htmlFor = 'environment-picker';

const EnvironmentPicker = ({ environments, onChange, value, title }) => (
  <div className="form-group">
    <label htmlFor={htmlFor}>
      {title}
      <select
        id={htmlFor}
        className="form-control"
        value={value}
        onChange={onChange}
      >
        {environments.map(environment => (
          <option key={environment._id} value={environment._id}>
            {environment.name}
          </option>
        ))}
      </select>
    </label>
  </div>
);

EnvironmentPicker.defaultProps = {
  onChange: () => null,
  value: undefined,
};

EnvironmentPicker.propTypes = {
  environments: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string,
  title: PropTypes.string,
};

EnvironmentPicker.defaultProps = {
  title: 'Select environment',
};

export default EnvironmentPicker;
