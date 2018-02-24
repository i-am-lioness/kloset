/* eslint-env browser */
/* global $ */
/* eslint no-mixed-operators: "off" */
/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint jsx-a11y/no-noninteractive-element-interactions: 0 */

import React from 'react';
import PropTypes from 'prop-types';

const resizeAnchors = {
  NW: 'nw',
  NE: 'ne',
  SW: 'sw',
  SE: 'se',
};

let $container;
const origSrc = new Image();
const eventState = {};
const constrain = true;
const minWidth = 60; // Change as required
const minHeight = 60;
const maxWidth = 1800; // Change as required
const maxHeight = 1900;
const resizeCanvas = document.createElement('canvas');

function saveEventState(e) {
  // Save the initial event details and container state
  eventState.container_width = $container.width();
  eventState.container_height = $container.height();
  eventState.container_left = $container.offset().left;
  eventState.container_top = $container.offset().top;
  eventState.mouse_x = (e.clientX
    || e.pageX
    || e.originalEvent.touches[0].clientX) + $(window).scrollLeft();
  eventState.mouse_y = (e.clientY
    || e.pageY
    || e.originalEvent.touches[0].clientY) + $(window).scrollTop();

  eventState.evnt = e;
}

function newDimensions(e, activeAnchor) {
  const mouse = {};
  let width;
  let height;
  let left;
  let top;

  mouse.x = (e.clientX || e.pageX) + $(window).scrollLeft();
  mouse.y = (e.clientY || e.pageY) + $(window).scrollTop();

  // Position image differently depending on the corner dragged and constraints
  switch (activeAnchor) {
    case resizeAnchors.SE:
      width = mouse.x - eventState.container_left;
      height = mouse.y - eventState.container_top;
      left = eventState.container_left;
      top = eventState.container_top;
      break;
    case resizeAnchors.SW:
      width = eventState.container_width - (mouse.x - eventState.container_left);
      height = mouse.y - eventState.container_top;
      left = mouse.x;
      top = eventState.container_top;
      break;
    case resizeAnchors.NW:
      width = eventState.container_width - (mouse.x - eventState.container_left);
      height = eventState.container_height - (mouse.y - eventState.container_top);
      left = mouse.x;
      top = mouse.y;
      if (constrain || e.shiftKey) {
        top = mouse.y - ((width / origSrc.width * origSrc.height) - height);
      }
      break;
    case resizeAnchors.NE:
      width = mouse.x - eventState.container_left;
      height = eventState.container_height - (mouse.y - eventState.container_top);
      left = eventState.container_left;
      top = mouse.y;
      if (constrain || e.shiftKey) {
        top = mouse.y - ((width / origSrc.width * origSrc.height) - height);
      }
      break;
    default:
      console.error('unrecognized anchor', eventState.evnt.target);
  }

  // Optionally maintain aspect ratio
  if (constrain || e.shiftKey) {
    height = width / origSrc.width * origSrc.height;
  }

  return {
    height,
    width,
    left,
    top,
  };
}

function newPosition(e) {
  const mouse = {};

  mouse.x = (e.clientX || e.pageX) + $(window).scrollLeft();
  mouse.y = (e.clientY || e.pageY) + $(window).scrollTop();
  $container.offset({
    left: mouse.x - (eventState.mouse_x - eventState.container_left),
    top: mouse.y - (eventState.mouse_y - eventState.container_top),
  });
}

class Resizer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      targetImageSrc: '',
    };

    this.activeAnchor = null;
    this.resizeMode = false;
    this.moveMode = false;
    this.targetImageElement = null;

    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.startMoveMode = this.startMoveMode.bind(this);
    this.startResizeMode = this.startResizeMode.bind(this);
    this.resizeImage = this.resizeImage.bind(this);
    this.resizing = this.resizing.bind(this);
    this.moving = this.moving.bind(this);
    this.handleSaveImage = this.handleSaveImage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.src !== this.props.src) {
      origSrc.src = nextProps.src;
      this.setState({ targetImageSrc: nextProps.src });
    }
  }

  componentDidMount() {
    $(document).on('mousemove', this.handleMouseMove);
    $(document).on('mouseup', this.handleMouseUp);
  }

  resizeImage(width, height) {
    resizeCanvas.width = width;
    resizeCanvas.height = height;
    resizeCanvas.getContext('2d').drawImage(origSrc, 0, 0, width, height);
    this.setState({ targetImageSrc: resizeCanvas.toDataURL('image/png') });
  }

  resizing(e) {
    const dims = newDimensions(e, this.activeAnchor);
    if (dims.width > minWidth
        && dims.height > minHeight
        && dims.width < maxWidth
        && dims.height < maxHeight) {
      // To improve performance you might limit how often resizeImage() is called
      this.resizeImage(dims.width, dims.height);
      // Without this Firefox will not re-calculate the the image dimensions until drag end
      $container.offset({ left: dims.left, top: dims.top });
    }
  }

  moving(e) {
    newPosition(e);
  }

  handleMouseMove(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.resizeMode) {
      this.resizing(e);
    } else if (this.moveMode) {
      this.moving(e);
    }
  }

  handleMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();

    this.activeAnchor = null;
    this.resizeMode = false;
    this.moveMode = false;
  }

  startResizeMode(e, corner) {
    e.preventDefault();
    e.stopPropagation();
    saveEventState(e);
    this.activeAnchor = corner;
    this.resizeMode = true;
  }

  startMoveMode(e) {
    e.preventDefault();
    e.stopPropagation();
    saveEventState(e);
    this.moveMode = true;
  }

  resizeHandle(corner) {
    return (
      <span
        className={`resize-handle resize-handle-${corner}`}
        onMouseDown={(e) => { this.startResizeMode(e, corner); }}
      />
    );
  }

  handleSaveImage() {
    // Find the part of the image that is inside the crop box

    const left = $('.overlay').offset().left - $container.offset().left;
    const top = $('.overlay').offset().top - $container.offset().top;
    const width = $('.overlay').width();
    const height = $('.overlay').height();

    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = width;
    cropCanvas.height = height;

    cropCanvas.getContext('2d').drawImage(this.targetImageElement, left, top, width, height, 0, 0, width, height);
    cropCanvas.toBlob(this.props.saveImage);
    //window.open(cropCanvas.toDataURL('image/png'));
  }

  render() {
    return (
      <div className="component" >
        <div className="overlay">
          <div className="overlay-inner" />
        </div>
        <div className="resize-container" ref={(el) => { $container = $(el); }} >
          {this.resizeHandle(resizeAnchors.NW)}
          {this.resizeHandle(resizeAnchors.NE)}
          <img
            className="resize-image"
            src={this.state.targetImageSrc}
            onMouseDown={this.startMoveMode}
            ref={(el) => { this.targetImageElement = el; }}
            alt="new clothing"
          />
          {this.resizeHandle(resizeAnchors.SW)}
          {this.resizeHandle(resizeAnchors.SE)}
        </div>
        <button onClick={this.handleSaveImage}>Save Image</button>
      </div>
    );
  }
}

Resizer.defaultProps = {
  /* folderMap: {},
  linkMap: {},
  currentFolder: ROOT_FOLDER,
  admin: false,
  deleteLink: null,
  editLink: null, */
};

Resizer.propTypes = {
  src: PropTypes.string.isRequired,
  saveImage: PropTypes.func.isRequired,
};

export default Resizer;
