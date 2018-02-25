/* eslint jsx-a11y/label-has-for: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { clothingTypes } from './kloset';

class ClothingEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clothingType: clothingTypes.TOP,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  componentDidMount() {
  }

  handleChange(event) {
    this.setState({ clothingType: event.target.value });
  }

  handleSubmit(event) {
    this.props.onSaveClothing({
      blob: this.state.blob,
      clothingType: this.state.clothingType,
    });
  }

  handleImageChange(blob) {
    this.setState({ blob });
  }

  render() {
    const options = Object.keys(clothingTypes).map((x) => {
      return (<option key={x} value={clothingTypes[x]}>{clothingTypes[x]}</option>);
    });

    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <div className="form-group">
            <label htmlFor="type-input">Type:</label>
            <select id="type-input" value={this.state.clothingType} onChange={this.handleChange}>
              <option value="-1" />
              {options}
            </select>
          </div>
          <br />
          <input type="submit" value="Save" />
        </div>
      </form>

    );
  }
}

ClothingEditor.defaultProps = {
};

ClothingEditor.propTypes = {
  onSaveClothing: PropTypes.func.isRequired,
  newImage: PropTypes.string.isRequired,
};

export default ClothingEditor;
