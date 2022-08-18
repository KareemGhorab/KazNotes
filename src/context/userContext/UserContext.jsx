import { createContext, useState, useContext, useEffect } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const KEY = "UserToken";

const UserContext = createContext();
const SetUserTokenContext = createContext();
const LogoutContext = createContext();
const TokenContext = createContext();

export const useUser = () => useContext(UserContext);
export const useSetUserToken = () => useContext(SetUserTokenContext);
export const useLogout = () => useContext(LogoutContext);
export const useToken = () => useContext(TokenContext);

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [storedToken, setStoredToken] = useLocalStorage(KEY, "");
	const navigate = useNavigate();

	useEffect(() => {
		if (!storedToken) {
			setUser(null);
			return;
		}
		setUser(jwtDecode(storedToken));
	}, [storedToken, navigate]);

	const logout = (callback) => {
		setStoredToken("");
		callback();
	};

	return (
		<UserContext.Provider value={user}>
			<TokenContext.Provider value={storedToken}>
				<SetUserTokenContext.Provider value={setStoredToken}>
					<LogoutContext.Provider value={logout}>
						{children}
					</LogoutContext.Provider>
				</SetUserTokenContext.Provider>
			</TokenContext.Provider>
		</UserContext.Provider>
	);
};
