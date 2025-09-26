#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for CareerBridge Vietnamese Job Recruitment Platform
Tests all backend endpoints including AI-powered features
"""

import requests
import json
import uuid
import base64
from datetime import datetime, timezone
import time

# Configuration
BASE_URL = "https://career-bridge-31.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class CareerBridgeAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.headers = HEADERS
        self.test_data = {}
        
    def log_test(self, test_name, success, details=""):
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if not success:
            print(f"   Error occurred in: {test_name}")
        print()
        
    def test_user_registration(self):
        """Test user registration API with both candidate and employer roles"""
        print("=== Testing User Registration API ===")
        
        # Test candidate registration
        candidate_data = {
            "email": f"nguyen.van.a.{uuid.uuid4().hex[:8]}@gmail.com",
            "name": "Nguyễn Văn A",
            "role": "candidate"
        }
        
        try:
            response = requests.post(f"{self.base_url}/register", 
                                   json=candidate_data, headers=self.headers)
            
            if response.status_code == 200:
                candidate_user = response.json()
                self.test_data['candidate_user'] = candidate_user
                self.log_test("Candidate Registration", True, 
                            f"User ID: {candidate_user['id']}, Email: {candidate_user['email']}")
            else:
                self.log_test("Candidate Registration", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Candidate Registration", False, f"Exception: {str(e)}")
            return False
            
        # Test employer registration
        employer_data = {
            "email": f"hr.company.{uuid.uuid4().hex[:8]}@techviet.com",
            "name": "Trần Thị B - HR Manager",
            "role": "employer"
        }
        
        try:
            response = requests.post(f"{self.base_url}/register", 
                                   json=employer_data, headers=self.headers)
            
            if response.status_code == 200:
                employer_user = response.json()
                self.test_data['employer_user'] = employer_user
                self.log_test("Employer Registration", True, 
                            f"User ID: {employer_user['id']}, Email: {employer_user['email']}")
            else:
                self.log_test("Employer Registration", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Employer Registration", False, f"Exception: {str(e)}")
            return False
            
        # Test duplicate email registration
        try:
            response = requests.post(f"{self.base_url}/register", 
                                   json=candidate_data, headers=self.headers)
            
            if response.status_code == 400:
                self.log_test("Duplicate Email Validation", True, "Correctly rejected duplicate email")
            else:
                self.log_test("Duplicate Email Validation", False, 
                            f"Should return 400, got: {response.status_code}")
                
        except Exception as e:
            self.log_test("Duplicate Email Validation", False, f"Exception: {str(e)}")
            
        return True
        
    def test_candidate_profile_management(self):
        """Test candidate profile CRUD operations"""
        print("=== Testing Candidate Profile Management ===")
        
        if 'candidate_user' not in self.test_data:
            self.log_test("Candidate Profile Management", False, "No candidate user available")
            return False
            
        user_id = self.test_data['candidate_user']['id']
        
        # Create candidate profile
        profile_data = {
            "skills": ["Python", "FastAPI", "React", "MongoDB", "Machine Learning"],
            "experience": "3 năm kinh nghiệm phát triển web full-stack, chuyên về Python và JavaScript. Đã tham gia nhiều dự án AI và machine learning.",
            "education": "Cử nhân Công nghệ Thông tin - Đại học Bách Khoa Hà Nội",
            "desired_position": "Senior Full-stack Developer",
            "desired_salary": 25000000,
            "location": "Hà Nội",
            "bio": "Lập trình viên đam mê công nghệ, luôn học hỏi và cập nhật kiến thức mới."
        }
        
        try:
            response = requests.post(f"{self.base_url}/candidates/{user_id}", 
                                   json=profile_data, headers=self.headers)
            
            if response.status_code == 200:
                candidate_profile = response.json()
                self.test_data['candidate_profile'] = candidate_profile
                self.log_test("Create Candidate Profile", True, 
                            f"Profile ID: {candidate_profile['id']}")
            else:
                self.log_test("Create Candidate Profile", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Create Candidate Profile", False, f"Exception: {str(e)}")
            return False
            
        # Get candidate profile
        try:
            response = requests.get(f"{self.base_url}/candidates/{user_id}")
            
            if response.status_code == 200:
                profile = response.json()
                self.log_test("Get Candidate Profile", True, 
                            f"Retrieved profile for: {profile['desired_position']}")
            else:
                self.log_test("Get Candidate Profile", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Get Candidate Profile", False, f"Exception: {str(e)}")
            
        # Update candidate profile
        update_data = {
            "skills": ["Python", "FastAPI", "React", "MongoDB", "Machine Learning", "Docker", "Kubernetes"],
            "experience": "4 năm kinh nghiệm phát triển web full-stack và DevOps",
            "education": "Cử nhân Công nghệ Thông tin - Đại học Bách Khoa Hà Nội",
            "desired_position": "Tech Lead",
            "desired_salary": 35000000,
            "location": "Hà Nội",
            "bio": "Tech Lead với kinh nghiệm quản lý team và kiến trúc hệ thống."
        }
        
        try:
            response = requests.put(f"{self.base_url}/candidates/{user_id}", 
                                  json=update_data, headers=self.headers)
            
            if response.status_code == 200:
                updated_profile = response.json()
                self.log_test("Update Candidate Profile", True, 
                            f"Updated position: {updated_profile['desired_position']}")
            else:
                self.log_test("Update Candidate Profile", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Update Candidate Profile", False, f"Exception: {str(e)}")
            
        return True
        
    def test_company_profile_management(self):
        """Test company profile management"""
        print("=== Testing Company Profile Management ===")
        
        if 'employer_user' not in self.test_data:
            self.log_test("Company Profile Management", False, "No employer user available")
            return False
            
        user_id = self.test_data['employer_user']['id']
        
        # Create company profile
        company_data = {
            "name": "TechViet Solutions",
            "description": "Công ty công nghệ hàng đầu Việt Nam chuyên phát triển giải pháp AI và machine learning cho doanh nghiệp.",
            "industry": "Công nghệ thông tin",
            "size": "100-500 nhân viên",
            "location": "Hà Nội, Việt Nam",
            "website": "https://techviet.com.vn"
        }
        
        try:
            response = requests.post(f"{self.base_url}/companies/{user_id}", 
                                   json=company_data, headers=self.headers)
            
            if response.status_code == 200:
                company_profile = response.json()
                self.test_data['company_profile'] = company_profile
                self.log_test("Create Company Profile", True, 
                            f"Company: {company_profile['name']}, ID: {company_profile['id']}")
            else:
                self.log_test("Create Company Profile", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Create Company Profile", False, f"Exception: {str(e)}")
            return False
            
        # Get company profile
        try:
            response = requests.get(f"{self.base_url}/companies/{user_id}")
            
            if response.status_code == 200:
                company = response.json()
                self.log_test("Get Company Profile", True, 
                            f"Retrieved: {company['name']} - {company['industry']}")
            else:
                self.log_test("Get Company Profile", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Get Company Profile", False, f"Exception: {str(e)}")
            
        return True
        
    def test_job_management(self):
        """Test job posting and management"""
        print("=== Testing Job Management ===")
        
        if 'company_profile' not in self.test_data:
            self.log_test("Job Management", False, "No company profile available")
            return False
            
        company_id = self.test_data['company_profile']['id']
        
        # Create job posting
        job_data = {
            "title": "Senior Python Developer - AI/ML Focus",
            "description": "Chúng tôi đang tìm kiếm Senior Python Developer có kinh nghiệm về AI/ML để tham gia team phát triển các sản phẩm AI tiên tiến. Ứng viên sẽ làm việc với các công nghệ như TensorFlow, PyTorch, FastAPI và các hệ thống phân tán.",
            "requirements": [
                "3+ năm kinh nghiệm Python",
                "Kinh nghiệm với FastAPI/Django",
                "Hiểu biết về Machine Learning",
                "Kinh nghiệm với MongoDB/PostgreSQL",
                "Kỹ năng tiếng Anh tốt"
            ],
            "salary_min": 20000000,
            "salary_max": 35000000,
            "location": "Hà Nội",
            "job_type": "full-time",
            "experience_level": "senior",
            "deadline": "2024-12-31T23:59:59Z"
        }
        
        try:
            response = requests.post(f"{self.base_url}/jobs/{company_id}", 
                                   json=job_data, headers=self.headers)
            
            if response.status_code == 200:
                job = response.json()
                self.test_data['job'] = job
                self.log_test("Create Job Posting", True, 
                            f"Job: {job['title']}, ID: {job['id']}")
            else:
                self.log_test("Create Job Posting", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Create Job Posting", False, f"Exception: {str(e)}")
            return False
            
        # Create another job for testing
        job_data2 = {
            "title": "Frontend Developer - React Specialist",
            "description": "Tìm kiếm Frontend Developer chuyên về React để phát triển giao diện người dùng cho các ứng dụng web hiện đại.",
            "requirements": [
                "2+ năm kinh nghiệm React",
                "Thành thạo JavaScript/TypeScript",
                "Kinh nghiệm với Redux/Context API",
                "Hiểu biết về responsive design"
            ],
            "salary_min": 15000000,
            "salary_max": 25000000,
            "location": "Hồ Chí Minh",
            "job_type": "full-time",
            "experience_level": "mid"
        }
        
        try:
            response = requests.post(f"{self.base_url}/jobs/{company_id}", 
                                   json=job_data2, headers=self.headers)
            
            if response.status_code == 200:
                job2 = response.json()
                self.log_test("Create Second Job Posting", True, 
                            f"Job: {job2['title']}")
            else:
                self.log_test("Create Second Job Posting", False, 
                            f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Create Second Job Posting", False, f"Exception: {str(e)}")
            
        # Get all jobs
        try:
            response = requests.get(f"{self.base_url}/jobs")
            
            if response.status_code == 200:
                jobs = response.json()
                self.log_test("Get All Jobs", True, 
                            f"Retrieved {len(jobs)} jobs")
            else:
                self.log_test("Get All Jobs", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Get All Jobs", False, f"Exception: {str(e)}")
            
        # Get specific job
        if 'job' in self.test_data:
            try:
                job_id = self.test_data['job']['id']
                response = requests.get(f"{self.base_url}/jobs/{job_id}")
                
                if response.status_code == 200:
                    job = response.json()
                    self.log_test("Get Specific Job", True, 
                                f"Retrieved: {job['title']}")
                else:
                    self.log_test("Get Specific Job", False, 
                                f"Status: {response.status_code}")
                    
            except Exception as e:
                self.log_test("Get Specific Job", False, f"Exception: {str(e)}")
                
        return True
        
    def test_ai_job_recommendations(self):
        """Test AI-powered job recommendations"""
        print("=== Testing AI Job Recommendations ===")
        
        if 'candidate_user' not in self.test_data:
            self.log_test("AI Job Recommendations", False, "No candidate user available")
            return False
            
        user_id = self.test_data['candidate_user']['id']
        
        try:
            response = requests.post(f"{self.base_url}/ai/job-recommendations/{user_id}")
            
            if response.status_code == 200:
                recommendations = response.json()
                self.log_test("AI Job Recommendations", True, 
                            f"Generated recommendations successfully")
                print(f"   AI Response Preview: {str(recommendations)[:200]}...")
            else:
                self.log_test("AI Job Recommendations", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("AI Job Recommendations", False, f"Exception: {str(e)}")
            return False
            
        return True
        
    def test_ai_candidate_recommendations(self):
        """Test AI-powered candidate recommendations"""
        print("=== Testing AI Candidate Recommendations ===")
        
        if 'company_profile' not in self.test_data or 'job' not in self.test_data:
            self.log_test("AI Candidate Recommendations", False, 
                        "No company profile or job available")
            return False
            
        company_id = self.test_data['company_profile']['id']
        job_id = self.test_data['job']['id']
        
        try:
            response = requests.post(f"{self.base_url}/ai/candidate-recommendations/{company_id}?job_id={job_id}")
            
            if response.status_code == 200:
                recommendations = response.json()
                self.log_test("AI Candidate Recommendations", True, 
                            f"Generated candidate recommendations successfully")
                print(f"   AI Response Preview: {str(recommendations)[:200]}...")
            else:
                self.log_test("AI Candidate Recommendations", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("AI Candidate Recommendations", False, f"Exception: {str(e)}")
            return False
            
        return True
        
    def test_ai_course_recommendations(self):
        """Test AI-powered course recommendations"""
        print("=== Testing AI Course Recommendations ===")
        
        if 'candidate_user' not in self.test_data:
            self.log_test("AI Course Recommendations", False, "No candidate user available")
            return False
            
        user_id = self.test_data['candidate_user']['id']
        
        try:
            response = requests.post(f"{self.base_url}/ai/course-recommendations/{user_id}")
            
            if response.status_code == 200:
                recommendations = response.json()
                self.log_test("AI Course Recommendations", True, 
                            f"Generated course recommendations successfully")
                print(f"   AI Response Preview: {str(recommendations)[:200]}...")
            else:
                self.log_test("AI Course Recommendations", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("AI Course Recommendations", False, f"Exception: {str(e)}")
            return False
            
        return True
        
    def test_cv_upload(self):
        """Test CV file upload functionality"""
        print("=== Testing CV File Upload ===")
        
        if 'candidate_user' not in self.test_data:
            self.log_test("CV File Upload", False, "No candidate user available")
            return False
            
        user_id = self.test_data['candidate_user']['id']
        
        # Create a sample CV file content
        cv_content = """
        NGUYỄN VĂN A
        Senior Full-stack Developer
        
        Email: nguyen.van.a@gmail.com
        Phone: +84 123 456 789
        Location: Hà Nội, Việt Nam
        
        KINH NGHIỆM LÀM VIỆC:
        - 4 năm phát triển web full-stack
        - Chuyên về Python, JavaScript, React
        - Kinh nghiệm với AI/ML projects
        
        KỸ NĂNG:
        - Python, FastAPI, Django
        - React, JavaScript, TypeScript
        - MongoDB, PostgreSQL
        - Docker, Kubernetes
        - Machine Learning, TensorFlow
        """
        
        try:
            # Simulate file upload using multipart/form-data
            files = {
                'file': ('cv_nguyen_van_a.txt', cv_content.encode(), 'text/plain')
            }
            
            response = requests.post(f"{self.base_url}/upload-cv/{user_id}", files=files)
            
            if response.status_code == 200:
                result = response.json()
                self.log_test("CV File Upload", True, 
                            f"Uploaded: {result.get('filename', 'CV file')}")
            else:
                self.log_test("CV File Upload", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("CV File Upload", False, f"Exception: {str(e)}")
            return False
            
        return True
        
    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting CareerBridge Backend API Testing")
        print(f"Base URL: {self.base_url}")
        print("=" * 60)
        
        test_results = {}
        
        # Run tests in sequence
        test_results['user_registration'] = self.test_user_registration()
        test_results['candidate_profile'] = self.test_candidate_profile_management()
        test_results['company_profile'] = self.test_company_profile_management()
        test_results['job_management'] = self.test_job_management()
        test_results['ai_job_recommendations'] = self.test_ai_job_recommendations()
        test_results['ai_candidate_recommendations'] = self.test_ai_candidate_recommendations()
        test_results['ai_course_recommendations'] = self.test_ai_course_recommendations()
        test_results['cv_upload'] = self.test_cv_upload()
        
        # Summary
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in test_results.values() if result)
        total = len(test_results)
        
        for test_name, result in test_results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{status} {test_name.replace('_', ' ').title()}")
            
        print(f"\nOverall: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All backend APIs are working correctly!")
        else:
            print("⚠️  Some backend APIs need attention")
            
        return test_results

if __name__ == "__main__":
    tester = CareerBridgeAPITester()
    results = tester.run_all_tests()