import React from 'react';
import PropTypes from 'prop-types';
import DetailsPanelNode from './DetailsPanelNode';
import DetailsPanelConnection from './DetailsPanelConnection';
import './detailsPanel.css';

class DetailsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      node: props.node,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { node } = nextProps;
    this.setState({ node });
  }

  render() {
    const { node } = this.state;
    const { closeCallback } = this.props;

    if (node.type === 'node') {
      return <DetailsPanelNode node={node} closeCallback={closeCallback} />;
    }
    return <DetailsPanelConnection node={node} closeCallback={closeCallback} />;
  }
}

DetailsPanel.propTypes = {
  closeCallback: PropTypes.func.isRequired,
  node: PropTypes.shape({}).isRequired,
};

export default DetailsPanel;
