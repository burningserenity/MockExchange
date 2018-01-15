import React from 'react';

export const Col = ({ size, children, style }) =>
<div className={`${size.split(" ").map(size => "col-" + size).join(" ")} user-wrap`} style={style}>
{children}
</div>;
