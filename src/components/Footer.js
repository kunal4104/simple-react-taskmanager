import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
	return (
		<footer>
			<p>Copyright &copy; 2021</p>
			<Link to="/About">About</Link>
		</footer>
	);
}

export default Footer;
