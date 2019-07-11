import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import Vizceral from 'vizceral-react';
import 'vizceral-react/dist/vizceral.css';

import CircularProgress from '@material-ui/core/CircularProgress';

import Environments from '../../../api/environments';
import Services from '../../../api/services';
import './styles.css';

import Breadcrumbs from '../../components/ServiceGraphBreadcrumbs';
import DetailsPanel from '../../components/ServiceGraphDetailsPanel';

import EnvironmentList from '../EnvironmentList';

class ServiceGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      environmentsToShow: [],
      skipUpdate: false,
      currentView: undefined,
      highlightedObject: null,
      displayOptions: {
        allowDraggingOfNodes: false,
        showLabels: true,
      },
      definitions: {
        detailedNode: {
          // These definitions are for switching what the detailed node shows
          volume: {
            // `volume` (default mode) is already defined internally, but can be customized by passing it in again with different configuration parameters
            default: {
              // default is required
              // top metric in the detailed node. set to null if you want it to be blank
              //   `header` is the text header to be displayed
              //   `data` is the path to the data to display on the node object
              //   `format` is how to format the data using numeral.js
              top: {header: 'Name', data: 'displayName', format: '' },
              // bottom metric in the detailed node. set to null if you want it to blank
              //   `header` is the text header to be displayed
              //   `data` is the path to the data to display on the node object
              //   `format` is how to format the data using numeral.js
              bottom: { header: '# Services', data: 'nodes.length', format: '' },
              donut: {},
            },
            entry: {
              // override for entry nodes
              top: { header: 'Name', data: 'displayName', format: ''  },
            },
          },
        },
      },
      modes: {
        detailedNode: 'volume',
      },
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { highlightedObject, skipUpdate } = this.state;
    if (
      skipUpdate ||
      (highlightedObject != null &&
        nextState.highlightedObject != null &&
        highlightedObject.name === nextState.highlightedObject.name)
    ) {
      return false;
    }
    return true;
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    console.log("SCROLLING"); // not working for some reason
  }

  buildServiceGraphForEnv = (envId, services) => {
    const filteredServices = services.filter(
      service => service.environment === envId,
    );
    const resultNodes = [];
    const resultConnections = [];

    filteredServices.forEach(service => {
      const serviceDisplayName = service.name.split('-')[2]; // corresponds to service
      const node = {
        name: serviceDisplayName,
        renderer: 'focusedChild',
        class: 'normal',
        maxVolume: 5000,
        metadata: service,
      };
      resultNodes.push(node);
      service.dependencies.forEach(s => {
        const edge = {
          source: serviceDisplayName,
          target: s.split('-')[2],
          metrics: {
            normal: 10, // hardcoded for now
          },
          class: 'normal',
          metadata: {
            sourceMetadata: service,
            targetMetadata: filteredServices.find(ser => ser.name === s),
          },
        };
        resultConnections.push(edge);
      });
    });

    return {
      nodes: resultNodes,
      connections: resultConnections,
    };
  };

  contructVizData = (environments, services) => {
    const entryNode = environments[0].identifier; // pick first environment as an entry node
    const nodes = [];
    const connections = [];
    let lastNode = null;
    let xInit = 0;
    const xOffset = 1000 * 1/environments.length;
    environments.forEach(env => {
      const envNodes = this.buildServiceGraphForEnv(env._id, services);
      const envNodeRep = {
        renderer: 'region',
        name: env.identifier,
        displayName: env.name,
        class: 'normal',
        maxVolume: 5000, // any number to ignore errors
        nodes: envNodes.nodes,
        connections: envNodes.connections,
        position:{x: xInit, y:100 },
      };
      xInit -= xOffset;
      nodes.push(envNodeRep);

      if (lastNode) {
        // all environment should be connected by an edge to be shown on the graph (no workaround)
        connections.push({
          source: env.identifier,
          target: lastNode,
          metrics: {
            normal: 5, // this means that some traffic would flow
          },
          class: 'normal',
        });
      }
      lastNode = env.identifier;
    });

    return {
      renderer: 'global',
      name: entryNode,
      entryNode,
      nodes,
      connections,
    };
  };

  viewChanged = data => {
    let changedState = {
      currentView: data.view,
    };

    if (data.view.length > 0) {
      const newEnvView = this.props.environments.filter(e => e.identifier === data.view[0]);
      changedState.environmentsToShow = newEnvView;
    } else {
      changedState.environmentsToShow = this.props.environments;
    }
    this.setState(changedState);
  };

  viewUpdated = () => {
    this.setState({});
  };

  objectHighlighted = highlightedObject => {
    const { skipUpdate } = this.state;
    if (!skipUpdate) {
      this.setState({ highlightedObject });
    } else {
      this.setState({ skipUpdate: false });
    }
  };

  navigationCallback = newNavigationState => {
    this.setState({ currentView: newNavigationState, highlightedObject: null });
  };

  detailsClosed = () => {
    this.setState({ highlightedObject: null, skipUpdate: true });
  };

  render() {
    const { environments, services } = this.props;
    const {
      currentView,
      displayOptions,
      physicsOptions,
      modes,
      definitions,
      highlightedObject,
    } = this.state;
    const trafficData =
      environments.length > 0
        ? this.contructVizData(environments, services)
        : [];

    const styles = {
      colorText: '#fd9644',
        colorTextDisabled: 'rgb(129, 129, 129)',
        colorTraffic: {
          normal: '#fd9644',
          normalDonut: 'rgb(91, 91, 91)',
          warning: 'rgb(268, 185, 73)',
          danger: 'rgb(184, 36, 36)',
        },
        colorNormalDimmed: 'rgb(101, 117, 128)',
        colorBackgroundDark: 'rgb(35, 35, 35)',
        colorLabelBorder: 'rgb(16, 17, 18)',
        colorLabelText: 'rgb(0, 0, 0)',
        colorDonutInternalColor: '#d1d8e0',
        colorConnectionLine: '#26de81',
        colorPageBackground: '#2f3542',
    };

    if(this.props.loading) {
      return <div style={{position: 'absolute', top: '50%', left: '60%', transform: 'translate(-50%, -50%)' }} > <CircularProgress /> </div>;
    }

    return (
      <div className="vizceral-container">
        <div className="subheader">
          <Breadcrumbs
            rootTitle="Root"
            navigationStack={currentView || []}
            navigationCallback={this.navigationCallback}
          />
        </div>
        <div className="service-traffic-map">
          <div
            style={{
              position: 'absolute',
              top: '0px',
              right: highlightedObject ? '380px' : '0px',
              bottom: '0px',
              left: '0px',
            }}
          >
            <Vizceral
              traffic={trafficData}
              view={currentView}
              showLabels={displayOptions.showLabels}
              viewChanged={this.viewChanged}
              physicsOptions={physicsOptions}
              objectHighlighted={this.objectHighlighted}
              modes={modes}
              allowDraggingOfNodes={displayOptions.allowDraggingOfNodes}
              definitions={definitions}
              styles={styles}
            />
          </div>
          {!!highlightedObject && (
            <DetailsPanel
              node={highlightedObject}
              closeCallback={this.detailsClosed}
            />
          )}
        </div>
        <EnvironmentList environments={this.state.environmentsToShow} />
      </div>
    );
  }
}

ServiceGraph.propTypes = {
  environments: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  services: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default withTracker(() => {
  const servicesSub = Meteor.subscribe('services');
  const envSub = Meteor.subscribe('environments');
return {
 loading: !(servicesSub.ready() && envSub.ready()),
 services: Services.find({}).fetch(),
 environments: Environments.find({}, { sort: { identifier: -1}}).fetch(),
};

})(ServiceGraph);
