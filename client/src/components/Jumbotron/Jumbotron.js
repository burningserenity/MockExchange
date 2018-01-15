import React from "react";


export const Jumbotron = ({ children }) => (
<div className="jumbotron"
style={styles.jumbo}>
{children}
</div>
)

const styles = {
	jumbo: {
		marginTop: '45px',
		backgroundColor: 'rgba(30, 30, 30, .65)'
			}
}
