import React, { useState, useEffect, useContext, createContext } from 'react';
import './App.css';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Context for user authentication
const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};

// Header Component
const Header = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-white font-bold text-2xl">
              🚀 CareerBridge
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-white">Xin chào, {user.name}</span>
                <span className="text-blue-200 text-sm">({user.role === 'candidate' ? 'Ứng viên' : 'Nhà tuyển dụng'})</span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="text-white">
                Chào mừng đến với CareerBridge
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Hero Component
const Hero = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Nền tảng tuyển dụng thông minh
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Kết nối ứng viên và nhà tuyển dụng thông qua AI. 
            Tìm việc phù hợp, gợi ý khóa học, và phát triển sự nghiệp của bạn.
          </p>
          
          <div className="flex justify-center items-center space-x-8 mt-12">
            <div className="text-center">
              <div className="bg-white p-6 rounded-full shadow-lg mb-4 mx-auto w-20 h-20 flex items-center justify-center">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-800">Tìm việc AI</h3>
              <p className="text-gray-600 text-sm">Gợi ý việc làm phù hợp</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-6 rounded-full shadow-lg mb-4 mx-auto w-20 h-20 flex items-center justify-center">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="font-semibold text-gray-800">Tìm ứng viên</h3>
              <p className="text-gray-600 text-sm">AI gợi ý ứng viên tốt nhất</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-6 rounded-full shadow-lg mb-4 mx-auto w-20 h-20 flex items-center justify-center">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="font-semibold text-gray-800">Khóa học AI</h3>
              <p className="text-gray-600 text-sm">Gợi ý kỹ năng cần học</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Login/Register Component
const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'candidate'
  });
  const { login, setLoading } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Simple login simulation (in real app, you'd verify credentials)
        const mockUser = {
          id: Date.now().toString(),
          email: formData.email,
          name: formData.name || formData.email.split('@')[0],
          role: formData.role
        };
        login(mockUser);
      } else {
        // Register new user
        const response = await axios.post(`${API}/register`, formData);
        login(response.data);
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Đăng nhập/Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Đăng nhập' : 'Đăng ký tài khoản'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Tham gia CareerBridge ngay hôm nay
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            {!isLogin && (
              <div>
                <input
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Họ tên"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            
            <div>
              <select
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="candidate">Ứng viên</option>
                <option value="employer">Nhà tuyển dụng</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-indigo-600 hover:text-indigo-500"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API}/jobs`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const getJobRecommendations = async () => {
    try {
      const response = await axios.post(`${API}/ai/job-recommendations/${user.id}`);
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    }
  };

  const getCourseRecommendations = async () => {
    try {
      const response = await axios.post(`${API}/ai/course-recommendations/${user.id}`);
      setRecommendations(response.data.courses);
    } catch (error) {
      console.error('Error getting course recommendations:', error);
    }
  };

  if (user.role === 'candidate') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Ứng viên</h1>
            <p className="mt-2 text-gray-600">Quản lý hồ sơ và tìm việc làm phù hợp</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'overview' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                  >
                    📊 Tổng quan
                  </button>
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'jobs' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                  >
                    💼 Việc làm
                  </button>
                  <button
                    onClick={() => setActiveTab('ai-jobs')}
                    className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'ai-jobs' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                  >
                    🤖 AI Gợi ý việc làm
                  </button>
                  <button
                    onClick={() => setActiveTab('ai-courses')}
                    className={`w-full text-left px-3 py-2 rounded-md ${activeTab === 'ai-courses' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                  >
                    📚 AI Gợi ý khóa học
                  </button>
                </nav>
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-3">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <span className="text-2xl">💼</span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Việc làm phù hợp</p>
                          <p className="text-2xl font-semibold text-gray-900">{jobs.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <span className="text-2xl">📝</span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Hồ sơ hoàn thiện</p>
                          <p className="text-2xl font-semibold text-gray-900">75%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <span className="text-2xl">🎯</span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">AI Scores</p>
                          <p className="text-2xl font-semibold text-gray-900">8.5/10</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Hoạt động gần đây</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-blue-500">•</span>
                        <span className="ml-2 text-sm text-gray-600">Bạn đã xem 5 việc làm mới hôm nay</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-500">•</span>
                        <span className="ml-2 text-sm text-gray-600">Hồ sơ của bạn được xem 12 lần tuần này</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-purple-500">•</span>
                        <span className="ml-2 text-sm text-gray-600">AI gợi ý 3 khóa học mới cho bạn</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'jobs' && (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Tất cả việc làm</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {jobs.slice(0, 5).map((job, index) => (
                      <div key={index} className="p-6 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900">{job.title}</h4>
                            <p className="mt-1 text-sm text-gray-600">📍 {job.location}</p>
                            <p className="mt-2 text-sm text-gray-700 line-clamp-2">{job.description}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {job.requirements?.slice(0, 3).map((req, i) => (
                                <span key={i} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            Ứng tuyển
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'ai-jobs' && (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">AI Gợi ý việc làm</h3>
                      <button
                        onClick={getJobRecommendations}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                      >
                        🤖 Lấy gợi ý AI
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    {recommendations ? (
                      <div className="space-y-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium text-purple-900 mb-2">✨ AI đã phân tích hồ sơ của bạn!</h4>
                          <pre className="text-sm text-purple-700 whitespace-pre-wrap">{recommendations}</pre>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <span className="text-6xl mb-4 block">🤖</span>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">AI sẵn sàng giúp bạn tìm việc!</h4>
                        <p className="text-gray-600 mb-6">Nhấn nút "Lấy gợi ý AI" để nhận được những gợi ý việc làm phù hợp nhất</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'ai-courses' && (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">AI Gợi ý khóa học</h3>
                      <button
                        onClick={getCourseRecommendations}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        📚 Lấy gợi ý khóa học
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    {recommendations ? (
                      <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-900 mb-2">📚 Khóa học AI gợi ý cho bạn:</h4>
                          <pre className="text-sm text-green-700 whitespace-pre-wrap">{recommendations}</pre>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <span className="text-6xl mb-4 block">📚</span>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Phát triển kỹ năng với AI!</h4>
                        <p className="text-gray-600 mb-6">AI sẽ phân tích hồ sơ và gợi ý những khóa học tốt nhất cho sự nghiệp của bạn</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Employer dashboard (simplified)
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Nhà tuyển dụng</h1>
          <p className="mt-2 text-gray-600">Quản lý tuyển dụng và tìm ứng viên phù hợp</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tin tuyển dụng</p>
                <p className="text-2xl font-semibold text-gray-900">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ứng viên</p>
                <p className="text-2xl font-semibold text-gray-900">48</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🤖</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">AI Matches</p>
                <p className="text-2xl font-semibold text-gray-900">15</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tính năng dành cho nhà tuyển dụng</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <div className="text-2xl mb-2">📝</div>
              <h4 className="font-medium">Đăng tin tuyển dụng</h4>
              <p className="text-sm text-gray-600">Tạo tin tuyển dụng mới</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <div className="text-2xl mb-2">🤖</div>
              <h4 className="font-medium">AI tìm ứng viên</h4>
              <p className="text-sm text-gray-600">Gợi ý ứng viên phù hợp nhất</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App
function App() {
  return (
    <UserProvider>
      <div className="App">
        <AppContent />
      </div>
    </UserProvider>
  );
}

const AppContent = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return (
      <>
        <Header />
        <Hero />
        <AuthForm />
      </>
    );
  }

  return (
    <>
      <Header />
      <Dashboard />
    </>
  );
};

export default App;