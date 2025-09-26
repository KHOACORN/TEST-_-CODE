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
    <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center opacity-10" 
           style={{backgroundImage: 'url(https://images.unsplash.com/photo-1740933084056-078fac872bff?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjB3b3JrcGxhY2V8ZW58MHx8fHwxNzU4Nzg4NzMxfDA&ixlib=rb-4.1.0&q=85)'}}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              🚀 Tương lai của tuyển dụng
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Nền tảng tuyển dụng <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              thông minh
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Kết nối ứng viên và nhà tuyển dụng thông qua AI tiên tiến. 
            Tìm việc phù hợp, gợi ý khóa học, và phát triển sự nghiệp của bạn một cách thông minh.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
            {/* AI Job Matching */}
            <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <img src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwzfHxBSSUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzU4ODQyMDY2fDA&ixlib=rb-4.1.0&q=85" 
                       alt="AI Brain" className="w-14 h-14 rounded-full object-cover"/>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Tìm việc AI</h3>
              <p className="text-gray-600 leading-relaxed">AI phân tích hồ sơ và gợi ý những công việc phù hợp nhất với kỹ năng của bạn</p>
            </div>
            
            {/* AI Candidate Matching */}
            <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <img src="https://images.unsplash.com/photo-1758520144427-ddb02ac74e9d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjB3b3JrcGxhY2V8ZW58MHx8fHwxNzU4Nzg4NzMxfDA&ixlib=rb-4.1.0&q=85" 
                       alt="Professional Interview" className="w-14 h-14 rounded-full object-cover"/>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">★</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Tìm ứng viên</h3>
              <p className="text-gray-600 leading-relaxed">AI gợi ý những ứng viên tốt nhất cho vị trí tuyển dụng của công ty</p>
            </div>
            
            {/* AI Course Recommendations */}
            <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwyfHxBSSUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzU4ODQyMDY2fDA&ixlib=rb-4.1.0&q=85" 
                       alt="AI Technology" className="w-14 h-14 rounded-full object-cover"/>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">📚</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Khóa học AI</h3>
              <p className="text-gray-600 leading-relaxed">Gợi ý những khóa học cần thiết để nâng cao kỹ năng và cơ hội việc làm</p>
            </div>
          </div>
          
          {/* Success Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">10K+</div>
              <div className="text-gray-600">Việc làm</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">5K+</div>
              <div className="text-gray-600">Ứng viên</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">95%</div>
              <div className="text-gray-600">Độ chính xác AI</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">500+</div>
              <div className="text-gray-600">Công ty</div>
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
                  {/* Welcome Section */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                    <div className="flex items-center space-x-4">
                      <img 
                        src="https://images.unsplash.com/photo-1758520144427-ddb02ac74e9d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjB3b3JrcGxhY2V8ZW58MHx8fHwxNzU4Nzg4NzMxfDA&ixlib=rb-4.1.0&q=85"
                        alt="Welcome" 
                        className="w-16 h-16 rounded-full object-cover border-4 border-white/30"
                      />
                      <div>
                        <h2 className="text-2xl font-bold">Chào mừng trở lại, {user.name}!</h2>
                        <p className="opacity-90">Hãy khám phá những cơ hội mới dành cho bạn</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                      <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-xl">
                          <img 
                            src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwzfHxBSSUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzU4ODQyMDY2fDA&ixlib=rb-4.1.0&q=85" 
                            alt="AI Brain" 
                            className="w-8 h-8 rounded object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Việc làm phù hợp</p>
                          <p className="text-3xl font-bold text-blue-600">{jobs.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                      <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-xl">
                          <span className="text-2xl">📝</span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Hồ sơ hoàn thiện</p>
                          <p className="text-3xl font-bold text-green-600">85%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                      <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-xl">
                          <img 
                            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwyfHxBSSUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzU4ODQyMDY2fDA&ixlib=rb-4.1.0&q=85" 
                            alt="AI Score" 
                            className="w-8 h-8 rounded object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">AI Score</p>
                          <p className="text-3xl font-bold text-purple-600">9.2/10</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Activity Feed */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Hoạt động gần đây
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm">👀</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700">Bạn đã xem 8 việc làm mới hôm nay</p>
                            <p className="text-xs text-gray-500">2 giờ trước</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-sm">📈</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700">Hồ sơ của bạn được xem 15 lần tuần này</p>
                            <p className="text-xs text-gray-500">1 ngày trước</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 text-sm">🤖</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700">AI gợi ý 5 khóa học mới cho bạn</p>
                            <p className="text-xs text-gray-500">2 ngày trước</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành động nhanh</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <span className="text-white text-lg">🔍</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">Tìm việc</span>
                        </button>
                        
                        <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group">
                          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <span className="text-white text-lg">📄</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">Cập nhật CV</span>
                        </button>
                        
                        <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group">
                          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <span className="text-white text-lg">🤖</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">AI Gợi ý</span>
                        </button>
                        
                        <button className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors group">
                          <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <span className="text-white text-lg">📚</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">Khóa học</span>
                        </button>
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <img 
                            src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwzfHxBSSUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzU4ODQyMDY2fDA&ixlib=rb-4.1.0&q=85" 
                            alt="AI" 
                            className="w-6 h-6 rounded object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">AI Gợi ý việc làm</h3>
                          <p className="text-sm text-gray-600">Được hỗ trợ bởi GPT-4o</p>
                        </div>
                      </div>
                      <button
                        onClick={getJobRecommendations}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
                      >
                        🤖 Lấy gợi ý AI
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    {recommendations ? (
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border border-purple-200 rounded-xl p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm">✨</span>
                            </div>
                            <h4 className="font-semibold text-purple-900">AI đã phân tích hồ sơ của bạn!</h4>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-purple-100">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{recommendations}</pre>
                          </div>
                        </div>
                        
                        {/* Success message */}
                        <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <span className="text-green-600 text-xl">🎯</span>
                          <div>
                            <p className="text-green-800 font-medium">Phân tích hoàn thành!</p>
                            <p className="text-green-600 text-sm">AI đã tìm được những việc làm phù hợp nhất với bạn</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="relative">
                          <img 
                            src="https://images.unsplash.com/photo-1716436329475-4c55d05383bb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxBSSUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNzU4ODQyMDY2fDA&ixlib=rb-4.1.0&q=85"
                            alt="AI Processor"
                            className="w-32 h-32 mx-auto rounded-full object-cover mb-6 shadow-lg"
                          />
                          <div className="absolute -top-2 -right-8 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center animate-pulse">
                            <span className="text-white text-xs">AI</span>
                          </div>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">AI sẵn sàng giúp bạn tìm việc!</h4>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                          GPT-4o sẽ phân tích hồ sơ của bạn và đề xuất những công việc phù hợp nhất 
                          dựa trên kỹ năng, kinh nghiệm và mong muốn nghề nghiệp
                        </p>
                        <div className="flex justify-center space-x-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Độ chính xác 95%</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Phân tích thông minh</span>
                          </div>
                        </div>
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
        <FeaturesSection />
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

// Features Section Component
const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tại sao chọn CareerBridge?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chúng tôi sử dụng AI tiên tiến để tạo ra trải nghiệm tuyển dụng tốt nhất
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="order-2 lg:order-1">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Thông minh</h3>
                  <p className="text-gray-600">Thuật toán AI học máy phân tích hồ sơ và đưa ra gợi ý chính xác 95%</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nhanh chóng</h3>
                  <p className="text-gray-600">Tìm được công việc phù hợp chỉ trong vòng 24 giờ</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Chính xác</h3>
                  <p className="text-gray-600">Matching algorithm đảm bảo độ phù hợp cao nhất</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1758518730162-09a142505bfd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxqb2IlMjByZWNydWl0bWVudHxlbnwwfHx8fDE3NTg4NTI5NTd8MA&ixlib=rb-4.1.0&q=85"
                alt="Professional Interview" 
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg">
                <div className="text-sm text-gray-600">Tỷ lệ thành công</div>
                <div className="text-2xl font-bold text-green-600">95%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1758520144420-3e5b22e9b9a4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b3JrcGxhY2V8ZW58MHx8fHwxNzU4Nzg4NzMxfDA&ixlib=rb-4.1.0&q=85"
                alt="Business Success" 
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white p-4 rounded-xl shadow-lg">
                <div className="text-sm">AI Powered</div>
                <div className="text-lg font-bold">🧠 GPT-4o</div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Phân tích thông minh</h3>
                  <p className="text-gray-600">AI phân tích xu hướng thị trường và đưa ra lời khuyên sự nghiệp</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Phát triển kỹ năng</h3>
                  <p className="text-gray-600">Gợi ý khóa học và lộ trình phát triển cá nhân hóa</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🤝</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Kết nối chuyên nghiệp</h3>
                  <p className="text-gray-600">Xây dựng mạng lưới quan hệ trong ngành</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Sẵn sàng bắt đầu hành trình?</h3>
            <p className="text-xl mb-8 opacity-90">Tham gia cùng hàng nghìn ứng viên và nhà tuyển dụng</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Đăng ký ngay
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default App;