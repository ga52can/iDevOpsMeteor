import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Content, Layout, MainHeader, MainSidebar } from 'reactjs-admin-lte';
import { withRouter, Link } from 'react-router-dom';
import md5 from 'md5';

class MainLayout extends Component {
  state = {
    activeLink: 'overview',
  };

  handleNav = (url, itemName) => {
    const { history } = this.props;
    history.push(url);
    this.setState({ activeLink: itemName });
  };

  render() {
    const { children, user } = this.props;
    const { activeLink } = this.state;

    return (
      <Layout skin="blue">
        <MainHeader>
          <MainHeader.Logo
            onClick={() => this.handleNav('/services/graph', 'overview')}
          >
            <MainHeader.Logo.Mini>
              <b>i</b>dev
            </MainHeader.Logo.Mini>
            <MainHeader.Logo.Large>
              <b>i</b>devops
            </MainHeader.Logo.Large>
          </MainHeader.Logo>
          <MainHeader.Navbar>
            <MainHeader.SidebarToggle />
            <div className="navbar-custom-menu">
              <ul className="nav navbar-nav">
                <li className="dropdown user user-menu">
                  <Link to="/profile" className="dropdown-toggle">
                    <img
                      src={`https://www.gravatar.com/avatar/${md5(
                        user.username,
                      )}`}
                      className="user-image"
                      alt="User avatar"
                    />
                    <span className="hidden-xs">{user.username}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </MainHeader.Navbar>
        </MainHeader>

        <MainSidebar>
          <MainSidebar.Menu>
            <MainSidebar.Menu.Header>COMPARISON</MainSidebar.Menu.Header>
            <MainSidebar.Menu.Item
              iconName="circle-o"
              onClick={() => this.handleNav('/services/graph', 'overview')}
              title="Overview"
              active={activeLink === 'overview'}
            />
            <MainSidebar.Menu.Item
              iconName="circle-o"
              onClick={() => this.handleNav('/services/table', 'serviceTable')}
              title="Service table"
              active={activeLink === 'serviceTable'}
            />
            <MainSidebar.Menu.Item
              iconName="circle-o"
              onClick={() =>
                this.handleNav('/services/matrix', 'serviceMatrix')
              }
              title="Service matrix"
              active={activeLink === 'serviceMatrix'}
            />
            <MainSidebar.Menu.Item
              iconName="circle-o"
              onClick={() => this.handleNav('/timeseries', 'timeseries')}
              title="Timeseries"
              active={activeLink === 'timeseries'}
            />
            <MainSidebar.Menu.Header>ALARMS</MainSidebar.Menu.Header>
            <MainSidebar.Menu.Item
              iconName="circle-o"
              onClick={() => this.handleNav('/alarms', 'alarms')}
              title="Alarms"
              active={activeLink === 'alarms'}
            />
          </MainSidebar.Menu>
        </MainSidebar>

        <Content>
          <Content.Body>{children}</Content.Body>
        </Content>
      </Layout>
    );
  }
}

MainLayout.propTypes = {
  user: PropTypes.shape().isRequired,
  history: PropTypes.shape({}).isRequired,
  children: PropTypes.node.isRequired,
};

export default withRouter(MainLayout);
