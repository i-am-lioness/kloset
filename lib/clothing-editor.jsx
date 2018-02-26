/* eslint jsx-a11y/label-has-for: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { seasonOptions } from './kloset-util';

class ClothingEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      season: props.currentItem.season || -1,
      description: props.currentItem.description || '',
      modified: false,
    };

    this.currentItem = Object.assign({}, props.currentItem);

    this.handleSeasonChange = this.handleSeasonChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
  }

  handleSeasonChange(event) {
    this.setState({
      season: event.target.value,
      modified: true,
    });
  }

  handleInput(e) {
    const { value, name } = e.target;

    this.setState({
      [name]: value,
      modified: true,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.currentItem.season = this.state.season;
    this.currentItem.description = this.state.description;
    this.props.onUpdateClothing(this.currentItem).then(this.reset);
  }

  reset() {
    this.setState({
      modified: false,
    });
  }

  render() {
    const imgURL = URL.createObjectURL(this.props.currentItem.blob);

    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <img src={imgURL} alt="article of clothing" />
          <div className="form-group">
            <label htmlFor="type-input">Season:</label>
            <select id="type-input" value={this.state.season} onChange={this.handleSeasonChange}>
              <option value="-1" />
              {seasonOptions()}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="desc-input">Description</label>
            <input onChange={this.handleInput} value={this.state.description} className="form-control input-lg" id="desc-input" name="description" placeholder="Description" />
          </div>
          <br />
          {this.state.modified && <input type="submit" value="Update" />}
        </div>
      </form>

    );
  }
}

ClothingEditor.defaultProps = {
};

ClothingEditor.propTypes = {
  onUpdateClothing: PropTypes.func.isRequired,
  currentItem: PropTypes.shape({
    timeStamp: PropTypes.number,
    blob: PropTypes.instanceOf(Blob),
    type: PropTypes.string,
  }).isRequired,
};

export default ClothingEditor;
