/* eslint-env browser */
/* global $ */
/* eslint no-mixed-operators: "off" */
/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint jsx-a11y/no-noninteractive-element-interactions: 0 */

import React from 'react';
import PropTypes from 'prop-types';

let $container;
const origSrc = new Image();
const eventState = {};
const constrain = true;
const minWidth = 60; // Change as required
const minHeight = 60;
const maxWidth = 800; // Change as required
const maxHeight = 900;
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

function newDimensions(e) {
  const mouse = {};
  let width;
  let height;
  let left;
  let top;

  mouse.x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft();
  mouse.y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();

  // Position image differently depending on the corner dragged and constraints
  if ($(eventState.evnt.target).hasClass('resize-handle-se')) {
    width = mouse.x - eventState.container_left;
    height = mouse.y - eventState.container_top;
    left = eventState.container_left;
    top = eventState.container_top;
  } else if ($(eventState.evnt.target).hasClass('resize-handle-sw')) {
    width = eventState.container_width - (mouse.x - eventState.container_left);
    height = mouse.y - eventState.container_top;
    left = mouse.x;
    top = eventState.container_top;
  } else if ($(eventState.evnt.target).hasClass('resize-handle-nw')) {
    width = eventState.container_width - (mouse.x - eventState.container_left);
    height = eventState.container_height - (mouse.y - eventState.container_top);
    left = mouse.x;
    top = mouse.y;
    if (constrain || e.shiftKey) {
      top = mouse.y - ((width / origSrc.width * origSrc.height) - height);
    }
  } else if ($(eventState.evnt.target).hasClass('resize-handle-ne')) {
    width = mouse.x - eventState.container_left;
    height = eventState.container_height - (mouse.y - eventState.container_top);
    left = eventState.container_left;
    top = mouse.y;
    if (constrain || e.shiftKey) {
      top = mouse.y - ((width / origSrc.width * origSrc.height) - height);
    }
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
      resizeMode: false,
      moveMode: false,
      targetImageSrc: '',
    };

    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.startMoveMode = this.startMoveMode.bind(this);
    this.startResizeMode = this.startResizeMode.bind(this);
    this.resizeImage = this.resizeImage.bind(this);
    this.resizing = this.resizing.bind(this);
    this.moving = this.moving.bind(this);
    this.endMoving = this.endMoving.bind(this);
    this.endResize = this.endResize.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.src !== this.props.src) {
      origSrc.src = nextProps.src;
      this.setState({ targetImageSrc: nextProps.src });
    }
  }

  resizeImage(width, height) {
    resizeCanvas.width = width;
    resizeCanvas.height = height;
    resizeCanvas.getContext('2d').drawImage(origSrc, 0, 0, width, height);
    this.setState({ targetImageSrc: resizeCanvas.toDataURL('image/png') });
  }

  resizing(e) {
    const dims = newDimensions(e);
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

  endMoving() {
    this.setState({ moveMode: false });
  }

  endResize() {
    this.setState({ resizeMode: false });
  }

  handleMouseMove(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.state.resizeMode) {
      this.resizing(e);
    } else if (this.state.moveMode) {
      this.moving(e);
    }
  }

  handleMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.state.resizeMode) {
      this.endResize();
    } else if (this.state.moveMode) {
      this.endMoving();
    }
  }

  startResizeMode(e) {
    e.preventDefault();
    e.stopPropagation();
    saveEventState(e);
    this.setState({ resizeMode: true });
  }

  startMoveMode(e) {
    e.preventDefault();
    e.stopPropagation();
    saveEventState(e);
    this.setState({ moveMode: true });
  }

  resizeHandle(corner) {
    return (
      <span
        className={`resize-handle resize-handle-${corner}`}
        onMouseDown={this.startResizeMode}
      />
    );
  }

  render() {
    return (
      <div
        className="component"
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        ref={(el) => { $container = $(el); }}
      >
        <div className="resize-container">
          {this.resizeHandle('nw')}
          {this.resizeHandle('ne')}
          <img
            className="resize-image"
            src={this.state.targetImageSrc}
            onMouseDown={this.startMoveMode}
            alt="new clothing"
          />
          {this.resizeHandle('sw')}
          {this.resizeHandle('se')}
        </div>
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
};

export default Resizer;
