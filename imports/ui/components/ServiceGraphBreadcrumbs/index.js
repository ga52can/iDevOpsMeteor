import React from 'react';
import PropTypes from 'prop-types';

import './breadcrumbs.css';

class Breadcrumbs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(nextProps) {
    const { navigationStack } = this.props;
    const { navigationStack: nextNavStack } = nextProps;
    if (nextNavStack) {
      if (nextNavStack.length !== navigationStack) {
        return true;
      }

      for (let i = 0; i < navigationStack.length; i += 1) {
        if (nextNavStack[i] !== navigationStack[i]) {
          return true;
        }
      }
    }
    return false;
  }

  handleClick(index) {
    const { navigationStack, navigationCallback } = this.props;
    const newState = navigationStack.slice(0, index + 1);
    navigationCallback(newState);
  }

  render() {
    const { navigationStack, rootTitle } = this.props;
    const navStack = navigationStack.slice() || [];
    navStack.unshift(rootTitle);
    /*eslint-disable */
    return (
      <div className="breadcrumbs">
        <ol>
          {navStack.map((state, index) =>
            index !== navStack.length - 1 ? (
              <li key={index + state}>
                <a
                  className="clickable"
                  onClick={() => {
                    this.handleClick(index - 1);
                  }}
                >
                  {state}
                </a>
              </li>
            ) : (
              <li key={index + state}>{state}</li>
            ),
          )}
        </ol>
      </div>
    );
    /* eslint-enable */
  }
}

Breadcrumbs.propTypes = {
  rootTitle: PropTypes.string.isRequired,
  navigationStack: PropTypes.arrayOf(PropTypes.string).isRequired,
  navigationCallback: PropTypes.func.isRequired,
};

export default Breadcrumbs;
