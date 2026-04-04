import { BrowserRouter } from "react-router-dom";
import AppRoutes from "routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "hooks/useAuth";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;