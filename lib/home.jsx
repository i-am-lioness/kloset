import React from 'react';
import ListView from './list-view';
import ClothingEditor from './clothing-editor';
import ClothingRegister from './clothing-register';

const fs = require('fs');
const clothingDB = require('../db.js');

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tops: [],
      bottoms: [],
      droppedImagePath: null,
      showClothingEditor: false,
    };

    this.storeFile = this.storeFile.bind(this);
    this.loadData = this.loadData.bind(this);
    this.onNewImage = this.onNewImage.bind(this);
    this.saveClothing = this.saveClothing.bind(this);
  }

  componentWillMount() {
    document.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();

      this.onNewImage(e.dataTransfer.files);
    });

    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  onNewImage(files) {
    let f;
    for (let i = 0; i < files.length; i += 1) {
      f = files[i];
      const droppedImagePath = `file://${encodeURI(f.path)}`;
      this.setState({
        droppedImagePath,
        showClothingEditor: true,
      });
    }
  }

  storeFile(filepath) {
    fs.readFile(filepath, (err, data) => {
      if (err) {
        return Promise.reject(err);
      }

      return clothingDB.add(filepath, data).then(this.loadData);
    });
  }

  loadData() {
    clothingDB.list({ type: 'top' }).then((tops) => {
      this.setState({ tops });
    });
    clothingDB.list({ type: 'bottom' }).then((bottoms) => {
      this.setState({ bottoms });
    });
  }

  componentDidMount() {
    clothingDB.init().then(this.loadData);
  }

  saveClothing(item) {
    clothingDB.add(item).then(this.loadData);
  }

  render() {
    return (
      <div>
        { this.state.showClothingEditor &&
          <ClothingRegister
            onSaveClothing={this.saveClothing}
            newImage={this.state.droppedImagePath}
          />}
        <h1>Tops</h1>
        <ListView items={this.state.tops} />
        <h1>Bottoms</h1>
        <ListView items={this.state.bottoms} />
      </div>
    );
  }
}

export default Home;
