import { Provider } from "react-redux";
import { store } from "./store";

// Just add the following 2 lines
// import { persistStore } from "redux-persist";
// import { PersistGate } from "redux-persist/integration/react";
// const persistor = persistStore(store);

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      {/* <PersistGate persistor={persistor}> */}
        {children}
      {/* </PersistGate> */}
    </Provider>
  );
}
