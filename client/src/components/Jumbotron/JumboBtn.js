import React from "react";
// import { Link } from 'react-router-dom';

export const JumboBtn = props =>
<div>
  <button {...props} type="button" style={{ float: "right" }} className="btn btn-primary btn-lg">
    {props.children}
  </button>

  </div>;
