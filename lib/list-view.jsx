/* eslint-env browser */
import React from 'react';
import PropTypes from 'prop-types';
import ImageLink from './image-link';

// import { CSSTransitionGroup } from 'react-transition-group';

function eachItem(item, idx) {
  return (
    <ImageLink
      key={item.timeStamp}
      item={item}
    />
  );
}

class ListView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // path: [{ id: ROOT_FOLDER, name: 'Resources' }],
    };
  }

  render() {
    const fileDisplay = this.props.items.map(eachItem);

    return (
      <div>
        <div
          className="list-group"
        >
          {fileDisplay}
        </div>
      </div>);
  }
}

ListView.defaultProps = {
  /* folderMap: {},
  linkMap: {},
  currentFolder: ROOT_FOLDER,
  admin: false,
  deleteLink: null,
  editLink: null, */
};

ListView.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ListView;
