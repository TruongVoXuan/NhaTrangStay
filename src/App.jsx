import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./hooks/useAuth";
import { FavoriteProvider } from "components/contexts/FavoriteContext"; //  thêm dòng này

import "react-toastify/dist/ReactToastify.css";
import ChatBot from "components/shared/User/common/ChatBot/ChatBot";
function App() {
  return (
    <AuthProvider>
      <FavoriteProvider> {/*  bọc ở đây */}
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
          <ChatBot />
        </BrowserRouter>
      </FavoriteProvider>
    </AuthProvider>
  );
}

export default App;