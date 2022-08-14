import Navbar from "./layouts/navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import NotFound from "./pages/notFound/NotFound";

function App() {
	return (
		<>
			<Navbar />
			<div className="container">
				<Routes>
					<Route path="/" element={<Home/>} />
					<Route path="/home" element={<Home/>} />
					<Route path="/login" element={<Login/>} />
					<Route path="/register" element={<Register/>} />
					<Route path="*" element={<NotFound/>} />
				</Routes>
			</div>
		</>
	);
}

export default App;
