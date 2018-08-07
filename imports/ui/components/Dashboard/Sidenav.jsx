import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { Meteor } from 'meteor/meteor';
import * as config from '../../../../config.json';
import AppWrapper from '../../containers/AppWrapper';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export default class Sidenav extends Component {
  render() {
    return (
      <AppWrapper>
        <div className="row">
          <Fragment>
            <div className="col m3 s1 menu_simple">
              {/* begin list */}
              <ul className="item-container">
                <li className="hide-on-med-and-down">
                  <a id="dashtweek" href="/dashboard/accounts" className="center">
                    <T>common.sidenav.dashboard</T>
                  </a>
                </li>
                <li>
                  <a href="/dashboard/accounts" className={`  side-list ${this.props.accounts}`}>
                    <i className={`fa fa-user fa-lg icon-white `} />
                    <span className="hide-on-small-only">
                      &nbsp; <T>common.sidenav.accounts</T>
                    </span>
                  </a>
                </li>

                {config.isHighSchool ? (
                  <li>
                    <a href="/dashboard/course" className={`  side-list ${this.props.course}`}>
                      <i className={`fa fa-book fa-lg `} />
                      <span className="hide-on-small-only">
                        &nbsp; <T>common.sidenav.subjects</T>
                      </span>
                    </a>
                  </li>
                ) : (
                  <Fragment>
                    <li>
                      <a href="/dashboard/course" className={`  side-list ${this.props.course}`}>
                        <i className={`fa fa-book fa-lg `} />
                        <span className="hide-on-small-only">
                          &nbsp; <T>common.sidenav.courses</T>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="/dashboard/list_topics"
                        className={`  side-list ${this.props.topics}`}
                      >
                        <i className={`fa fa-text-width fa-lg `} />
                        <span className="hide-on-small-only">
                          &nbsp; <T>common.sidenav.alltopics</T>
                        </span>
                      </a>
                    </li>
                  </Fragment>
                )}
                <li>
                  <a href="/dashboard/extra" className={`  side-list ${this.props.extra}`}>
                    <i className={`fa fa-th fa-lg `} />
                    <span className="hide-on-small-only">
                      &nbsp; <T>common.sidenav.resourceLibrary</T>
                    </span>
                  </a>
                </li>
                <li>
                  <a href="/externallinks" className={`side-list ${this.props.externallinks}`}>
                    <i className={`fa fa-link `} />
                    <span className="hide-on-small-only">
                      &nbsp; <T>common.sidenav.externalLinks</T>
                    </span>
                  </a>
                </li>
                {config.isUserAuth ? (
                  <li>
                    <a href="/dashboard/overview" className={`  side-list ${this.props.stats}`}>
                      <i className={`fa fa-bar-chart fa-lg `} />
                      <span className="hide-on-small-only">
                        &nbsp; <T>common.sidenav.stats</T>
                      </span>
                    </a>
                  </li>
                ) : (
                  <span />
                )}
                <li>
                  <a href="/dashboard/feedback" className={`  side-list ${this.props.feedback}`}>
                    <i className={`fa fa-comments fa-lg `} />
                    <span className="hide-on-small-only">
                      &nbsp; <T>common.sidenav.feedback</T>
                    </span>
                  </a>
                </li>

                {/* only show settings, sliders for admin only */}
                {Roles.userIsInRole(Meteor.userId(), ['admin']) ? (
                  <>
                    <li>
                      <a href="/setup" className={`  side-list ${this.props.settings}`}>
                        <i className={`fa fa-gear fa-lg `} />
                        <span className="hide-on-small-only">
                          &nbsp; <T>common.sidenav.setup</T>
                        </span>
                      </a>
                    </li>

                    <li>
                      <a href="/dashboard/slides" className={`  side-list ${this.props.slides}`}>
                        <i className={`fa fa-picture-o `} />
                        <span className="hide-on-small-only">
                          &nbsp; <T>common.sidenav.changeSlides</T>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="/dashboard/updates" className={`  side-list ${this.props.slides}`}>
                        <i className={`fa fa-picture-o `} />
                        <span className="hide-on-small-only">
                          &nbsp; <T>common.sidenav.updates</T>
                        </span>
                      </a>
                    </li>
                  </>
                ) : (
                  <span />
                )}
                <li>
                  <a href="#" className="small">
                    <span className="sideHide item">
                      <code>version 1.0</code>
                    </span>
                  </a>
                </li>
              </ul>
              {/* end list (ul) */}
            </div>
          </Fragment>
          <Fragment>{this.props.yield}</Fragment>
        </div>
      </AppWrapper>
    );
  }
}
Sidenav.propTypes = {
  accounts: PropTypes.string,
  extra: PropTypes.string,
  stats: PropTypes.string,
  feedback: PropTypes.string,
  topics: PropTypes.string,
  resources: PropTypes.string,
  settings: PropTypes.string,
  sliding: PropTypes.string,
  course: PropTypes.string,
  externallinks: PropTypes.string,
};
