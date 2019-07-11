import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 300,
  },
  inputLabel: {
    fontSize: '24px',
    fontWeight: 400,
  },
  select: {
    fontSize: '16px',
  },
  menuItem: {
    fontSize: '16px',
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class Dropdown extends React.Component {
  handleChange = evt => {
    const { onChangeHandler } = this.props;
    onChangeHandler(evt.target.value);
  };

  render() {
    const {
      selectedValue,
      selectionArray,
      disabled,
      label,
      id,
      classes,
    } = this.props;

    /* eslint-disable */
    const values = disabled
      ? null
      : selectionArray.map(selectable => (
          <MenuItem className={classes.menuItem} key={selectable} value={selectable}>
            {selectable}
          </MenuItem>
        ));
    /* eslint-enable */

    const selectStyle = { marginTop: '24px' };

    return (
      <FormControl className={classes.formControl} disabled={disabled}>
        <InputLabel className={classes.inputLabel} shrink htmlFor={id}>
          {label}
        </InputLabel>
        <Select
          className={classes.select}
          value={selectedValue}
          onChange={this.handleChange}
          name={id}
          input={<Input id={id} />}
          style={selectStyle}
        >
          {values}
        </Select>
      </FormControl>
    );
  }
}

Dropdown.defaultProps = {
  disabled: false,
};

Dropdown.propTypes = {
  onChangeHandler: PropTypes.func.isRequired,
  selectedValue: PropTypes.string,
  selectionArray: PropTypes.arrayOf(PropTypes.string).isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Dropdown);
