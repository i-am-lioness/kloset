import React from 'react';
import ListView from './list-view';
import ClothingEditor from './clothing-editor';
import ClothingRegister from './clothing-register';

const clothingDB = require('../db.js');

const views = {
  HOME: 0,
  REGISTER: 1,
  EDIT: 2,
};

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tops: [],
      bottoms: [],
      droppedImagePath: null,
      view: views.HOME,
    };

    this.loadData = this.loadData.bind(this);
    this.onNewImage = this.onNewImage.bind(this);
    this.saveClothing = this.saveClothing.bind(this);
    this.updateClothing = this.updateClothing.bind(this);
    this.viewClothing = this.viewClothing.bind(this);
    this.navigateHome = this.navigateHome.bind(this);
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
        view: views.REGISTER,
      });
    }
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

  updateClothing(item) {
    return clothingDB.update(item);
  }

  viewClothing(currentItem) {
    this.setState({
      view: views.EDIT,
      currentItem,
    });
  }

  navigateHome() {
    this.setState({ view: views.HOME });
  }

  render() {
    let display;

    let homeButton = <button onClick={this.navigateHome} type="button">Home</button>;

    switch (this.state.view) {
      case views.REGISTER:
        display = (<ClothingRegister
          onSaveClothing={this.saveClothing}
          newImage={this.state.droppedImagePath}
        />);
        break;
      case views.EDIT:
        display = (<ClothingEditor
          onUpdateClothing={this.updateClothing}
          currentItem={this.state.currentItem}
        />);
        break;
      default:
        homeButton = null;
        display = (
          <div>
            <h1>Tops</h1>
            <ListView items={this.state.tops} onClothingClicked={this.viewClothing} />
            <h1>Bottoms</h1>
            <ListView items={this.state.bottoms} onClothingClicked={this.viewClothing} />
          </div>
        );
    }

    return (
      <div>
        { homeButton }
        { display }
      </div>
    );
  }
}

export default Home;
