import Navbar from "./layouts/navbar/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import NotFound from "./pages/notFound/NotFound";
import { useUser } from "./context/userContext/UserContext";

const LoggedInUserRoute = ({ children }) => {
	const user = useUser();
	if (!user) {
		return <Navigate to="/login" />;
	}
	return <>{children}</>;
};

const GuestUser = ({ children }) => {
	const user = useUser();
	if (user) {
		return <Navigate to="/home" />;
	}
	return <>{children}</>;
};

function App() {
	return (
		<>
			<Navbar />
			<Routes>
				<Route path="/" element={<Login />} />
				<Route
					path="/home"
					element={
						<LoggedInUserRoute>
							<Home />
						</LoggedInUserRoute>
					}
				/>
				<Route
					path="/login"
					element={
						<GuestUser>
							<Login />
						</GuestUser>
					}
				/>
				<Route
					path="/register"
					element={
						<GuestUser>
							<Register />
						</GuestUser>
					}
				/>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</>
	);
}

export default App;
