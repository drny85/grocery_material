import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { Signin, Signup } from "./pages/Auth";
import { Home } from "./pages/Home";
import { auth } from "./database";
import { setLogin, userStore } from "./reduxStore/actions/userActions";
import { useDispatch } from "react-redux";
import { Orders } from "./pages/Orders";
import { AdminPage, AllItems } from "./pages/Admin";
import OrderDetails from "./pages/Orders/OrderDetails";
import PastOrders from "./pages/Orders/PastOrders";
import { getItems } from "./reduxStore/actions/itemsActions";
import { getCategories } from "./reduxStore/actions/categoriesActions";
import AllCategories from "./pages/Admin/Categories/AllCategories";
import ItemDetails from "./pages/Admin/Items/ItemDetails";
import AddItem from "./pages/Admin/Items/AddItem";
import EditItem from "./pages/Admin/Items/EditItem";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#4f83cc",
      main: "#00695f",
      dark: "#002f6c",
    },
    secondary: {
      light: "#718792",
      main: "#1c54b2",
      dark: "#1c313a",
      contrastText: "#eceff1",
    },
    background: "#ecf0f1",
    progress: "#ffc107",
    delivered: "#4caf50",
    new: "#3f51b5",
  },
});

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(setLogin(user));
        dispatch(userStore(user.uid));
        dispatch(getItems(user.uid));
        dispatch(getCategories(user.uid));
      }
    });
  }, [dispatch]);
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/categories" component={AllCategories} />
          <Route exact path="/pastOrders" component={PastOrders} />
          <Route exact path="/item/details/:id" component={ItemDetails} />
          <Route exact path="/admin/allItems/:id" component={AllItems} />
          <Route exact path="/admin/item/edit/:id" component={EditItem} />
          <Route exact path="/admin/item" component={AddItem} />
          <Route exact path="/admin" component={AdminPage} />
          <Route exact path="/orders/:id" component={OrderDetails} />
          <Route exact path="/orders" component={Orders} />
          <Route exact path="/signin" component={Signin} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/" component={Home} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
