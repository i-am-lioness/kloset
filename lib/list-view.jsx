/* eslint-env browser */
import React from 'react';
import PropTypes from 'prop-types';
import ImageLink from './image-link';

// import { CSSTransitionGroup } from 'react-transition-group';

class ListView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // path: [{ id: ROOT_FOLDER, name: 'Resources' }],
    };

    this.eachItem = this.eachItem.bind(this);
  }

  eachItem(item, idx) {
    return (
      <ImageLink
        key={item.timeStamp}
        item={item}
        onClick={(e) => { this.props.onClothingClicked(item); }}
      />
    );
  }

  render() {
    const fileDisplay = this.props.items.map(this.eachItem);

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
};

ListView.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClothingClicked: PropTypes.func.isRequired,
};

export default ListView;
