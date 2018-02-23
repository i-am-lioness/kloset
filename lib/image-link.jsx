/* eslint-env browser */
import React from 'react';
import PropTypes from 'prop-types';

class ImageLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // path: [{ id: ROOT_FOLDER, name: 'Resources' }],
    };
  }

  render() {
    const { item } = this.props;
    const binaryData = [];
    binaryData.push(item.file);
    const blob = new Blob(binaryData);
    const imgURL = URL.createObjectURL(blob);

    return (
      <img
        className="folder-content-item list-group-item list-group-item-action"
        src={imgURL}
        alt={item.name}
        height="200px"
        width="150px"
      />
    );
  }
}

ImageLink.defaultProps = {
  /* folderMap: {},
  linkMap: {},
  currentFolder: ROOT_FOLDER,
  admin: false,
  deleteLink: null,
  editLink: null, */
};

ImageLink.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    file: PropTypes.instanceOf(Uint8Array),
  }).isRequired,
};

export default ImageLink;
