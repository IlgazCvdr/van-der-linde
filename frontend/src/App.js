import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import LoginRegisterPage from './pages/LoginRegisterPage/LoginRegisterPage.js';
import HomePage from './pages/HomePage/HomePage.js';
import Layout from './components/Layout/Layout.js';
import PageNotFound from './pages/PageNotFound/PageNotFound.js';
import { AuthProvider } from './contexts/AuthContext.js';
import UserPage from './pages/UserPage/UserPage.js';
import ProductPage from './pages/ProductPage/ProductPage.js';
import { ModalProvider } from './contexts/ModalContext.js';
import CreateProductPage from './pages/CreateProductPage/CreateProductPage.js';
import EditProductPage from './pages/EditProductPage/EditProductPage.js'; // Import the EditProductPage component
import EditReviewPage from './pages/EditReviewPage/EditReviewPage.js';
import AdminDashboardPage from './pages/AdminDashboardPage/AdminDashboardPage.js';
import ForumPage from './pages/ForumPage/ForumPage.js';
import SearchBar from './components/SearchBar/SearchBar.js';
import QAPage from './pages/QAPage/QAPage.js';
import QuestionPage from "./pages/QuestionPage/QuestionPage.js"
import CreateQuestionPage from './pages/CreateQustionPage/CreateQuestionPage.js';
import EditQuestionPage from './pages/EditQuestionPage/EditQuestionPage.js';
import EditAnswerPage from './pages/EditAnswerPage/EditAnswerPage.js';
import ManageAccountPage from './pages/ManagerAccountPage/ManageAccountPage.js';
import CategoryPage from './pages/CategoryPage/CategoryPage.js';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage.js';
import ForumsPage from './pages/ForumsPage/ForumsPage.js';
import CreateForumPostPage from './pages/CreateForumPostPage/CreateForumPostPage.js';
import EditForumPostPage from './pages/EditForumPostPage/EditForumPostPage.js';
import EditForumPostReplyPage from './pages/EditForumPostReplyPage/EditForumPostReplyPage.js';
import LocalCommunityListPage from './pages/LocalCommunityListPage/LocalCommunityListPage.js';
import CreateLocalCommunityPage from './pages/CreateLocalCommunityPage/CreateLocalCommunityPage.js';
import LocalCommunityPage from './pages/LocalCommunityPage/LocalCommunityPage.js';
import CreateLocalCommunityPostPage from './pages/CreateLocalCommunityPostPage/CreateLocalCommunityPostPage.js';
import EditLocalCommunityPostPage from './pages/EditLocalCommunityPostPage/EditLocalCommunityPostPage.js';
import EditLocalCommunityPage from './pages/EditLocalCommunityPage/EditLocalCommunityPage.js';
import MerchantDashboardPage from './pages/MerchantDashboardPage/MerchantDashboardPage.js';

function App() {
  return (
    <BrowserRouter>
      <ModalProvider>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="login-register" element={<LoginRegisterPage />} />
              <Route path="user/:userId" element={<UserPage />} />
              <Route path="product/:productId" element={<ProductPage />} />
              <Route path="create-product" element={<CreateProductPage />} />
              <Route path="edit-review/:reviewId" element={<EditReviewPage />}/>
              <Route path="admin-dashboard" element={<AdminDashboardPage />}/>
              <Route path="edit/:productId" element={<EditProductPage />} />
              <Route path="/search" component={<SearchBar/>}/>
              <Route path="forums" element={<ForumsPage />} /> {/* Add the route for the ForumPage */}
              <Route path="/forums/:postId" element={<ForumPage />} />
              <Route path="/forums/edit-post/:postId" element={<EditForumPostPage />} />
              <Route path="/forums/edit-reply/:replyId" element={<EditForumPostReplyPage />} />
              <Route path="forums/create-forum" element={<CreateForumPostPage />} />
              <Route path="qa" element={<QAPage/>}/>
              <Route path="qa/question/:questionId" element={<QuestionPage/>}/>
              <Route path="qa/create-question" element={<CreateQuestionPage/>}/>
              <Route path="qa/edit-question/:questionId" element={<EditQuestionPage/>}/>
              <Route path="qa/edit-answer/:answerId" element={<EditAnswerPage/>}/>
              <Route path="manage-account/:userId" element={<ManageAccountPage/>}/>
              <Route path="category/:categoryName" element={<CategoryPage />} /> {/* Add the route for the CategoryPage */}
              <Route path="forgot-password" element={<ForgotPasswordPage/>}/>
              <Route path="forums" element={<ForumsPage />} /> {/* Add the route for the ForumPage */}
              <Route path="local-communities" element={<LocalCommunityListPage/>}/>
              <Route path="create-local-community" element={<CreateLocalCommunityPage/>}/>
              <Route path="local-community/:communityId" element={<LocalCommunityPage/>}/>
              <Route path="create-local-community-post/:communityId" element={<CreateLocalCommunityPostPage/>}/>
              <Route path="edit-local-community-post/:postId" element={<EditLocalCommunityPostPage/>}/>
              <Route path="edit-local-community/:communityId" element={<EditLocalCommunityPage/>}/>
              <Route path="merchant-dashboard" element={<MerchantDashboardPage/>}/>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </ModalProvider>
    </BrowserRouter>
  );
}
export default App;
