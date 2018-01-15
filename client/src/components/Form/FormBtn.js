import React from "react";

export const FormBtn = props =>
  <button {...props} className="btn btn-outline-success btn-lg">
    {props.children}
    Submit
  </button>;

export const Checkbtn = props => (
  <span className="btn-outline-success" style = {{float : "right", fontSize: "30px"}} {...props}>
    ✓
  </span>
);
