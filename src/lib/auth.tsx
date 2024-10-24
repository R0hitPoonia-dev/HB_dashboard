import {
  useLazyGetUserQuery,
  useLoginUserMutation,
  useLogoutUserMutation,
} from "@/redux/api/authApi";
import * as React from "react";

export interface AuthContext {
  isAuthenticated: boolean;
  login: ({ email, pass }: { email: string; pass: string }) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
  user: { name: string; profilePhoto: string } | null;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContext | null>(null);

const key = "token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(getStoredToken());
  const [loading, setLoading] = React.useState<boolean>(true);
  // const [isAuthenticated, setIsAuthenticated] =
  // React.useState<boolean>(!!token);
  const isAuthenticated = !!token;
  const [user, setUser] = React.useState<{
    name: string;
    profilePhoto: string;
  } | null>(null);
  const [loginUser, loginUserHelper] = useLoginUserMutation();
  const [getUser, getUserHelper] = useLazyGetUserQuery();
  const [logoutUser] = useLogoutUserMutation();

  function getStoredToken() {
    return sessionStorage.getItem(key);
  }

  function setStoredToken(user: string | null) {
    if (user) {
      sessionStorage.setItem(key, user);
    } else {
      sessionStorage.removeItem(key);
    }
  }

  // async function getUserApi(token: string | null) {
  //   if (!token) return null;
  //   else {
  //     getUser(null);
  //     return { name: "Rohit", profilePhoto: "" };
  //   }
  // }

  const handleGetUser = async () => {
    setLoading(true);
    setToken(getStoredToken());
    try {
      const result = await getUser(null);
      if (result.data) {
        setUser(result.data.adminData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = React.useCallback(async () => {
    try {
      sessionStorage.removeItem(key);
      setUser(null);
      setStoredToken(null);
      setToken(null);
      await logoutUser();
    } catch (error) {
      console.error(error);
    }
  }, [logoutUser]);
  // [logoutUser] is a destructured array containing the logoutUser mutation function from the useLogoutUserMutation hook.
  // The empty dependency array [] means the useCallback function will only be recreated when the component mounts,
  // and not on every render. This prevents the creation of a new function reference on every render,
  // which can cause issues with dependencies and memoization.

  // const logout = React.useCallback(async () => {
  //   await sleep(250);
  //   //logout query
  //   logoutUser();
  //   setUser(null);
  //   setStoredToken(null);
  //   setToken(null);
  // }, []);

  const login = React.useCallback(
    async ({ email, pass }: { email: string; pass: string }) => {
      try {
        setLoading(true);
        await loginUser({ email: email, password: pass });
        if (loginUserHelper.isSuccess && loginUserHelper.data) {
          await getUser(null);
          if (getUserHelper.isSuccess && getUserHelper.data)
            console.log(getUserHelper.data);
          setUser({
            name: loginUserHelper.data.data.name,
            profilePhoto: loginUserHelper.data.data.profilePhoto,
          });
          // const token = loginUserHelper.data.token;
          // setStoredToken(token);
          // setToken(token);
          // setIsAuthenticated(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [loginUser, getUser]
  );
  // const login = React.useCallback(
  //   async ({ email, pass }: { email: string; pass: string }) => {
  //     await sleep(500);
  //     //login query
  //     loginUser({ email: email, password: pass });

  //     setUser(await getUserApi(pass)); //will get user from query
  //     setStoredToken(email); //will get token from query
  //     setToken(email); //will get token from query
  //   },
  //   [],
  // );
  React.useEffect(() => {
    handleGetUser();
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
