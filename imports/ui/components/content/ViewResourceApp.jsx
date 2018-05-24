import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { PropTypes } from 'prop-types';
import { _Topics } from '../../../api/topics/topics';
import { _FileDetails } from '../../../api/resources/resources';
import ViewFrame from './ViewFrame.jsx';
import ResourceRender from './ResourceRender.jsx';
import { insertStatistics } from '../Statistics/Statistics.jsx';
import { FloatingButton } from '../Utilities/Utilities.jsx';
import ErrorBoundary from '../ErrorBoundary';
import { Loader } from '../Loader';
import { Resources } from '../../../api/resources/resources';
import * as config from '../../../../config.json';

export class ViewResourceApp extends Component {
  static extractFileType(data) {
    const fileTypeData = data.split('/');
    let type = fileTypeData[0];
    if (type === 'application') {
      [, type] = fileTypeData;
    }
    return type;
  }

  static saveUsage(name) {
    const id = FlowRouter.getQueryParam('rs');
    const material = name;
    const urlData = FlowRouter.current();
    const url = urlData.path;
    const user = Meteor.userId();
    const date = new Date();
    const page = 'RESOURCE';
    const data = {
      id,
      material,
      url,
      page,
      date,
      user,
    };
    insertStatistics(data);
  }

  fetchResource() {
    let { resource } = this.props;
    if (resource === undefined) {
      resource = null;
    }
    return resource;
  }

  renderResource() {
    const resourceObj = this.fetchResource();
    if (resourceObj === null) {
      return null;
    }
    const resources = resourceObj;
    const resource = {
      type: resources.type,
      ext: resources.ext,
      name: resources.name,
      urlLink: resourceObj.link(),
      _id: resources._id,
    };
    return <ResourceRender resource={resource}  Link={resourceObj.link()}/>;
  }

  fetchResources() {
    const query = this.props.resources;
    if (!query) {
      return null;
    }
    let data = query;
    if (query === undefined) {
      data = [
        {
          id: 0,
          topicId: 0,
          name: '',
          file: {
            size: 0,
            type: null,
            url: '#',
          },
        },
      ];
    }

    if (data.length === 0) {
      data = [
        {
          id: 0,
          topicId: 0,
          name: '',
          file: {
            size: 0,
            type: null,
            url: '#',
          },
        },
      ];
    }
    return data;
  }

  static getUrl() {
    const sectionId = FlowRouter.getQueryParam('scid');
    const url = `/contents/${sectionId}?rs=${FlowRouter.getParam('_id')}`;
    return url;
  }

  render() {
    return (
      <ErrorBoundary>
        <div className="row">
          <div className="col s12 m8 l9">{this.renderResource()}</div>
          
           {/* <img src={"http://localhost:3000/cdn/storage/Resources/7A7FqFTZH9fgspsEC/original/7A7FqFTZH9fgspsEC.png"}
           /> */}

          <div className="col s12 m4 l3 ">
            <ViewFrame resources={this.props.resources} />
          </div>
        </div>

        <div className="">
          <FloatingButton className="left" />{' '}
        </div>
      </ErrorBoundary>
    );
  }
}

export function getResourceWithId(coll) {
  if (coll === undefined) {
    return 'null';
  }
  const resourceArray = coll.resources;
  let resource = null;
  for (let index = 0; index < resourceArray.length; index += 1) {
    const element = resourceArray[index];
    if (element._id === FlowRouter.getQueryParam('rs')) {
      resource = element.file;
    } else {
      return null;
    }
    return resource;
  }
}
ViewResourceApp.propTypes = {
  resources: PropTypes.array,
  chapters: PropTypes.object,
  sectionName: PropTypes.string,
  resource: PropTypes.object,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('resourcess');
  if (config.isHighScool) {
    return {
      subsReady: handle.ready(),
      resources: Resources.find(
        {
          'meta.unitId': FlowRouter.getParam('_id'),
        },
        { sort: { type: 1 } },
      ).fetch(),
      resource: Resources.findOne({ _id: FlowRouter.getQueryParam('rs') }),
    };
  }
  Meteor.subscribe('topics');
  return {
    subsReady: handle.ready(),
    resources: Resources.find(
      {
        'meta.topicId': FlowRouter.getParam('_id'),
      },
      { sort: { type: 1 } },
    ).fetch(),
    resource: Resources.findOne({ _id: FlowRouter.getQueryParam('rs') }),
  };
})(ViewResourceApp);
