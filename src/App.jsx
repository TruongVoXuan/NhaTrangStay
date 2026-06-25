import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./hooks/useAuth";
import { FavoriteProvider } from "components/contexts/FavoriteContext";

import "react-toastify/dist/ReactToastify.css";
import ChatBot from "components/shared/User/common/ChatBot/ChatBot";

function AppContent() {
  const location = useLocation();

  // Các route không hiển thị chatbot
  const hiddenChatBotRoutes = ["/login", "/register" ,"/forgot-password", "/reset-password",];

  const shouldHideChatBot = hiddenChatBotRoutes.includes(
    location.pathname
  );

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />

      <AppRoutes />

      {!shouldHideChatBot && <ChatBot />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <FavoriteProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </FavoriteProvider>
    </AuthProvider>
  );
}

export default App;