/* eslint class-methods-use-this: "off" */
import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { PropTypes } from 'prop-types';
import { Slides } from '../../../api/settings/slides';

let timeOut;
export class ImgSlider extends Component {
  componentWillUnmount() {
    Meteor.clearTimeout(timeOut);
  }

  renderSlider(slides) {
    if (!slides || !slides.length) {
      return (
        <li>
          <div
            className="center"
            style={{
              marginTop: 120,
            }}
          >
            <h4 className="light white-text text-lighten-1">Welcome To SparkEd</h4>
            <h5 className="light white-text text-lighten-1">
              Kindly upload Slides images From the Dashboard
            </h5>
          </div>
        </li>
      );
    }
    return slides.map(slide => (
      <li key={slide._id}>
        <img src={`/uploads/slides/${slide._id}.${slide.ext}`} />
      </li>
    ));
  }
  render() {
    timeOut = Meteor.setTimeout(() => {
      $('.slider').slider('start');
      $('.slider').slider({ full_width: true, indicators: false });
    }, 5);
    return (
      <div className="slider" style={{ marginTop: '-21px' }}>
        <ul className="slides">{this.renderSlider(this.props.slides)}</ul>
      </div>
    );
  }
}

ImgSlider.propTypes = {
  slides: PropTypes.array.isRequired,
};

export default withTracker(() => {
  Meteor.subscribe('slides');
  return {
    slides: Slides.find({}).fetch(),
  };
})(ImgSlider);
