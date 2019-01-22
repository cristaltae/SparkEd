/* eslint default-case: 0, no-case-declarations: 0, no-unused-expressions: 0 */
import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import M from 'materialize-css';
import { Slides } from '../../../../api/settings/slides';
import {
  handleCheckboxChange,
  handleCheckAll,
  getCheckBoxValues,
} from '../../Utilities/CheckBoxHandler.jsx';
import UploadWrapper from '../../../../ui/modals/UploadWrapper';
import MainModal from '../../../../ui/modals/MainModal';
import { closeModal } from '../../../../ui/modals/methods.js';

export class ManageSlides extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      isOpen: false,
      modalIdentifier: '',
      modalType: '',
      title: '',
      confirm: '',
      reject: '',
      ids: [],
      name: '',
      code: '',
    };
  }

  componentDidMount() {
    M.AutoInit();
  }

  closeModal = () => {
    this.setState(closeModal);
  };
  // ide => modalType, id=> schoolId
  toggleEditModal = (ide, id = '', name = '') => {
    // check if the user has full rights
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      M.toast({ html: '<span>Only Admins can edit the Manage</span>' });
      return;
    }
    this.name = name;
    this.id = id;

    switch (ide) {
      case 'edit':
        this.setState({
          modalIdentifier: this.id,
          modalType: ide,
          title: 'Edit Slide',
          confirm: 'Save',
          reject: 'Close',
          name: this.name,
        });

        break;

      case 'del':
        const slides = getCheckBoxValues('chk');
        const count = slides.length;
        const SlideName = count > 1 ? 'slide' : 'slides';

        if (count < 1) {
          M.toast({ html: '<span>Please check atleast one resource</span>' });
          return;
        }
        this.setState({
          modalIdentifier: 'id',
          modalType: ide,
          title: `Are you sure to delete ${count} ${SlideName}`,
          confirm: 'Yes',
          reject: 'No',
          ids: slides,
        });
        break;
      case 'upload':
        this.setState({
          modalIdentifier: '',
          modalType: ide,
          title: 'Upload a slide',
          confirm: 'Save', // this should be out
          reject: 'Close', // this too should be out
        });
        break;
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  handleSubmit(e) {
    e.preventDefault();
    const { modalType, ids, modalIdentifier } = this.state;

    switch (modalType) {
      case 'edit':
        const name = e.target.slide.value;
        Meteor.call('editSlides', modalIdentifier, name, err => {
          err
            ? M.toast({ html: `<span>${err.reason}</span>` })
            : M.toast({ html: '<span>Successfully Updated</span>' });
        });
        break;
      case 'del':
        let count = 0;
        ids.map(id => {
          count += 1;
          const sName = count > 1 ? 'slides' : 'slide';
          Meteor.call('removeSlides', id, err => {
            err
              ? M.toast({ html: `<span>${err.reason}</span>` })
              : M.toast({ html: `<span>${count} ${sName} successfully deleted</span>` });
          });
        });
        break;
    }
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  renderslides() {
    let count = 1;
    if (this.props.slides === undefined) {
      return null;
    }

    return this.props.slides.map(slide => (
      <tr className="link-section" key={slide._id}>
        <td>{count++}</td>
        <td>{slide.name.replace(/\.[^/.]+$/, '')}</td>
        <td>
          <a
            href=""
            className="fa fa-pencil"
            onClick={e => this.toggleEditModal('edit', slide._id, slide.name, e)}
          />
        </td>
        <td>{slide.meta.createdAt.toDateString()}</td>
        <td>
          <img
            className="materialboxed"
            style={{ width: 150, height: 100 }}
            src={`/uploads/slides/${slide._id}.${slide.ext}`}
            data-caption={slide.name.replace(/\.[^/.]+$/, '')}
          />
        </td>

        <td onClick={handleCheckboxChange.bind(this, slide._id)}>
          <label htmlFor={slide._id}>
            <input type="checkbox" id={slide._id} className={`chk chk${slide._id}`} />
            <span/>
          </label>
        </td>
      </tr>
    ));
  }

  render() {
    const {
 isOpen, title, confirm, reject, modalType, name 
} = this.state;

    return (
      <Fragment>
      {modalType === 'upload' ? (
            <UploadWrapper show={isOpen} close={this.closeModal} title={title} />
          ) : (
            <MainModal
              show={isOpen}
              onClose={this.closeModal}
              subFunc={this.handleSubmit}
              title={title}
              confirm={confirm}
              reject={reject}
            >
              {modalType === 'del' ? (
                <span />
              ) : (
                <div className="input-field">
                  <input
                    placeholder="Name of Slide"
                    type="text"
                    defaultValue={name}
                    className="validate clear"
                    required
                    name="slide"
                  />
                </div>
              )}
            </MainModal>
          )}
          <div className="col m9 s11">
          <div className="">
            <h4>Manage Slides</h4>
          </div>

          <div className="row">
            <div className="col m3">
              <button
                className="btn red darken-3 "
                onClick={e => this.toggleEditModal('del', e)}
              >
                Delete
              </button>
            </div>

            <div className="col s4 m4">
              <button
                className="btn green darken-4 "
                onClick={e => this.toggleEditModal('upload', e)}
              >
                {' '}
                Upload New Slider
              </button>
            </div>
          </div>

          <table className="highlight">
            <thead>
              <tr>
                <th>#</th>
                <th>Slides Motto</th>
                <th>Edit Motto</th>
                <th>Uploaded At</th>
                <th>Slides Image</th>

                <th onClick={handleCheckAll.bind(this, 'chk-all', 'chk')}>
                <label>
                  <input
                    type="checkbox"
                    className=" chk-all"
                    
                  />
                    Check All
                  </label>
                </th>
              </tr>
            </thead>
            <tbody>{this.renderslides()}</tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}

Slides.propTypes = {
  slides: PropTypes.array.isRequired,
};

export default withTracker(() => {
  Meteor.subscribe('slides');
  Meteor.subscribe('deleted');
  Meteor.subscribe('searchdata');
  return {
    slides: Slides.find().fetch(),
  };
})(ManageSlides);
