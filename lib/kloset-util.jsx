import React from 'react';
import { seasons } from './kloset';

const renderOptions = (obj) => {
  const options = Object.keys(obj).map((x) => {
    return (<option key={x} value={obj[x]}>{obj[x]}</option>);
  });
  return options;
};

const seasonOptions = () => {
  return renderOptions(seasons);
};

export { renderOptions, seasonOptions };
