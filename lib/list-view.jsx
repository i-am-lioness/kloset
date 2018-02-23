/* eslint-env browser */
import React from 'react';
import PropTypes from 'prop-types';
// import { CSSTransitionGroup } from 'react-transition-group';

function eachItem(item, idx) {
  const binaryData = [];
  binaryData.push(item.file);
  const blob = new Blob(binaryData);
  const imgURL = URL.createObjectURL(blob);

  return (
    <img
      className="folder-content-item list-group-item list-group-item-action"
      key={item.timeStamp}
      src={imgURL}
      alt={item.name}
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
