import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
	return (
		<nav className="navbar navbar-expand-lg bg-main navbar-dark sticky-top">
			<div className="container">
				<Link className="navbar-brand" to="/">
					Notes
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav ms-auto mb-2 mb-lg-0">
						<li className="nav-item dropdown">
							<Link
								className="nav-link dropdown-toggle"
								to="/"
								role="button"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								Login
							</Link>
							<ul className="dropdown-menu">
								<li>
									<Link to="/register" className="dropdown-item">
										Sign Up
									</Link>
								</li>
								<li>
									<Link to="/login" className="dropdown-item">
										Sign In
									</Link>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
}
