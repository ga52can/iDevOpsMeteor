import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  typography: {
    margin: '20px 0px 20px 6px',
    fontWeight: 400,
  },
});

function Heading(props) {
  const { classes, text, variant } = props;
  return (
    <Typography variant={variant} className={classes.typography}>
      {text}
    </Typography>
  );
}

Heading.defaultProps = {
  variant: 'h2',
};

Heading.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.string,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Heading);
