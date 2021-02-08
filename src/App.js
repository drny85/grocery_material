import React, { useEffect, useState } from "react";
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
import Loader from "./components/Loader";
import AdminRoute from "./middlewares/AdminRoute";
import PrivateRoute from "./middlewares/PrivateRoute";
import StoresPage from "./pages/Stores/StoresPage";
import StoreApplication from "./pages/Stores/StoreApplication";
import DeveloperRoute from "./middlewares/DeveloperRoute";
import StoreDetails from "./pages/Stores/StoreDetails";
import ApplicationStatus from "./pages/Stores/ApplicationStatus";
import StoreProfile from "./pages/Stores/StoreProfile";
import StoreInfo from "./pages/Stores/StoreInfo";
import StoreUsers from "./pages/Stores/StoreUsers";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#4f83cc",
      main: "#ab003c",
      dark: "#002f6c",
    },
    secondary: {
      light: "#718792",
      main: "#ff9100",
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
  const [starting, setStarting] = useState(true)
  useEffect(() => {
    
  const userSub =  auth.onAuthStateChanged( (user) => {
     
      if (user) {
       
        dispatch(setLogin(user));
        dispatch(userStore(user.uid));
        dispatch(getItems(user.uid));
        dispatch(getCategories(user.uid));
        setStarting(false)
      } else {
        setStarting(false)
      }
    });

    return () => {
      
      console.log('App Unmounted')
     userSub && userSub()
    }
  }, [dispatch]);

  if (starting)  return <Loader />
    
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <AdminRoute exact path="/categories" component={AllCategories} />
          <AdminRoute exact path="/admin/storeInfo/:id" component={StoreInfo} />
          <AdminRoute exact path="/admin/store/users" component={StoreUsers} />
          <PrivateRoute exact path="/pastOrders" component={PastOrders} />
          <PrivateRoute exact path="/item/details/:id" component={ItemDetails} />
          <PrivateRoute exact path="/admin/allItems/:id" component={AllItems} />
          <PrivateRoute exact path="/admin/item/edit/:id" component={EditItem} />
          <AdminRoute exact path="/admin/item" component={AddItem} />
          <AdminRoute exact path="/admin" component={AdminPage} />
          <DeveloperRoute exact path="/admin/stores" component={StoresPage} />
          <DeveloperRoute exact path="/admin/store/details/:id" component={StoreDetails} />
          <Route exact path="/store/profile/:id" component={StoreProfile} />
          <Route exact path="/store/application" component={StoreApplication} />
          <Route exact path="/store/application/status/:id" component={ApplicationStatus} />
          
          <PrivateRoute exact path="/orders/:id" component={OrderDetails} />
          <PrivateRoute exact path="/orders" component={Orders} />
          <Route exact path="/signin" component={Signin} />
          <Route exact path="/signup" component={Signup} />
          <PrivateRoute exact path="/" component={Home} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
