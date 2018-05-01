import React from 'react';
import './menus.css';

export const Menu = props =>
  <div className="pure-menu pure-menu-horizontal">
    <a onClick={props.onClick} className="pure-menu-heading pure-menu-link">{props.menuItem}</a>
  </div>;
