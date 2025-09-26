from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage
import json
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Pydantic Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    role: str  # "candidate" or "employer"
    avatar: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: str
    name: str
    role: str

class Candidate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    skills: List[str] = []
    experience: str = ""
    education: str = ""
    cv_file: Optional[str] = None
    desired_position: str = ""
    desired_salary: Optional[int] = None
    location: str = ""
    bio: str = ""
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CandidateCreate(BaseModel):
    skills: List[str] = []
    experience: str = ""
    education: str = ""
    desired_position: str = ""
    desired_salary: Optional[int] = None
    location: str = ""
    bio: str = ""

class Company(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    description: str
    industry: str
    size: str
    location: str
    website: Optional[str] = None
    logo: Optional[str] = None
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CompanyCreate(BaseModel):
    name: str
    description: str
    industry: str
    size: str
    location: str
    website: Optional[str] = None

class Job(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_id: str
    title: str
    description: str
    requirements: List[str] = []
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    location: str
    job_type: str  # "full-time", "part-time", "contract", "internship"
    experience_level: str  # "entry", "mid", "senior", "executive"
    posted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    deadline: Optional[datetime] = None
    is_active: bool = True

class JobCreate(BaseModel):
    title: str
    description: str
    requirements: List[str] = []
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    location: str
    job_type: str
    experience_level: str
    deadline: Optional[datetime] = None

class AIRecommendation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    type: str  # "job", "candidate", "course"
    content: Dict[str, Any]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AIChat(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_id: str
    message: str
    response: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Helper functions
def prepare_for_mongo(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = value.isoformat()
    return data

def parse_from_mongo(item):
    if isinstance(item, dict):
        for key, value in item.items():
            if isinstance(value, str) and key.endswith('_at'):
                try:
                    item[key] = datetime.fromisoformat(value)
                except:
                    pass
    return item

# Authentication routes
@api_router.post("/register", response_model=User)
async def register_user(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(**user_data.dict())
    user_dict = prepare_for_mongo(user.dict())
    await db.users.insert_one(user_dict)
    return user

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    user_data = await db.users.find_one({"id": user_id})
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**parse_from_mongo(user_data))

# Candidate routes
@api_router.post("/candidates/{user_id}", response_model=Candidate)
async def create_candidate_profile(user_id: str, candidate_data: CandidateCreate):
    # Check if user exists
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    candidate = Candidate(user_id=user_id, **candidate_data.dict())
    candidate_dict = prepare_for_mongo(candidate.dict())
    await db.candidates.insert_one(candidate_dict)
    return candidate

@api_router.get("/candidates/{user_id}", response_model=Candidate)
async def get_candidate_profile(user_id: str):
    candidate_data = await db.candidates.find_one({"user_id": user_id})
    if not candidate_data:
        raise HTTPException(status_code=404, detail="Candidate profile not found")
    return Candidate(**parse_from_mongo(candidate_data))

@api_router.put("/candidates/{user_id}", response_model=Candidate)
async def update_candidate_profile(user_id: str, candidate_data: CandidateCreate):
    existing_candidate = await db.candidates.find_one({"user_id": user_id})
    if not existing_candidate:
        raise HTTPException(status_code=404, detail="Candidate profile not found")
    
    updated_data = candidate_data.dict()
    updated_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.candidates.update_one(
        {"user_id": user_id}, 
        {"$set": prepare_for_mongo(updated_data)}
    )
    
    updated_candidate = await db.candidates.find_one({"user_id": user_id})
    return Candidate(**parse_from_mongo(updated_candidate))

# Company routes
@api_router.post("/companies/{user_id}", response_model=Company)
async def create_company_profile(user_id: str, company_data: CompanyCreate):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    company = Company(user_id=user_id, **company_data.dict())
    company_dict = prepare_for_mongo(company.dict())
    await db.companies.insert_one(company_dict)
    return company

@api_router.get("/companies/{user_id}", response_model=Company)
async def get_company_profile(user_id: str):
    company_data = await db.companies.find_one({"user_id": user_id})
    if not company_data:
        raise HTTPException(status_code=404, detail="Company profile not found")
    return Company(**parse_from_mongo(company_data))

# Job routes
@api_router.post("/jobs/{company_id}", response_model=Job)
async def create_job(company_id: str, job_data: JobCreate):
    company = await db.companies.find_one({"id": company_id})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    job = Job(company_id=company_id, **job_data.dict())
    job_dict = prepare_for_mongo(job.dict())
    await db.jobs.insert_one(job_dict)
    return job

@api_router.get("/jobs", response_model=List[Job])
async def get_jobs(skip: int = 0, limit: int = 20):
    jobs = await db.jobs.find({"is_active": True}).skip(skip).limit(limit).to_list(length=None)
    return [Job(**parse_from_mongo(job)) for job in jobs]

@api_router.get("/jobs/{job_id}", response_model=Job)
async def get_job(job_id: str):
    job_data = await db.jobs.find_one({"id": job_id})
    if not job_data:
        raise HTTPException(status_code=404, detail="Job not found")
    return Job(**parse_from_mongo(job_data))

# AI-powered recommendation routes
@api_router.post("/ai/job-recommendations/{user_id}")
async def get_job_recommendations(user_id: str):
    try:
        # Get candidate profile
        candidate = await db.candidates.find_one({"user_id": user_id})
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate profile not found")
        
        # Get recent jobs
        jobs = await db.jobs.find({"is_active": True}).limit(10).to_list(length=None)
        
        # Initialize AI chat
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        session_id = f"job_rec_{user_id}_{uuid.uuid4()}"
        
        chat = LlmChat(
            api_key=api_key,
            session_id=session_id,
            system_message="Bạn là chuyên gia tư vấn tuyển dụng thông minh. Hãy phân tích hồ sơ ứng viên và gợi ý các công việc phù hợp nhất."
        ).with_model("openai", "gpt-4o")
        
        prompt = f"""
        Dựa trên thông tin ứng viên:
        - Kỹ năng: {', '.join(candidate.get('skills', []))}
        - Kinh nghiệm: {candidate.get('experience', '')}
        - Vị trí mong muốn: {candidate.get('desired_position', '')}
        - Địa điểm: {candidate.get('location', '')}
        
        Và danh sách công việc hiện có:
        {json.dumps([{
            'id': job['id'],
            'title': job['title'], 
            'description': job['description'][:200] + '...',
            'requirements': job.get('requirements', []),
            'location': job['location'],
            'experience_level': job['experience_level']
        } for job in jobs], ensure_ascii=False, indent=2)}
        
        Hãy gợi ý TOP 3 công việc phù hợp nhất và giải thích tại sao. Format JSON:
        {
            "recommendations": [
                {
                    "job_id": "id",
                    "title": "tên công việc",
                    "match_percentage": 85,
                    "reasons": ["lý do 1", "lý do 2"],
                    "tips": "lời khuyên để tăng cơ hội"
                }
            ]
        }
        """
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Store recommendation
        recommendation = AIRecommendation(
            user_id=user_id,
            type="job",
            content={"response": response, "session_id": session_id}
        )
        await db.ai_recommendations.insert_one(prepare_for_mongo(recommendation.dict()))
        
        return {"recommendations": response}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI recommendation failed: {str(e)}")

@api_router.post("/ai/candidate-recommendations/{company_id}")
async def get_candidate_recommendations(company_id: str, job_id: str):
    try:
        # Get job details
        job = await db.jobs.find_one({"id": job_id})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Get candidates
        candidates = await db.candidates.find().limit(10).to_list(length=None)
        
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        session_id = f"candidate_rec_{company_id}_{uuid.uuid4()}"
        
        chat = LlmChat(
            api_key=api_key,
            session_id=session_id,
            system_message="Bạn là chuyên gia tuyển dụng AI. Hãy phân tích và gợi ý những ứng viên phù hợp nhất cho vị trí tuyển dụng."
        ).with_model("openai", "gpt-4o")
        
        prompt = f"""
        Vị trí tuyển dụng:
        - Tiêu đề: {job['title']}
        - Mô tả: {job['description'][:300]}...
        - Yêu cầu: {', '.join(job.get('requirements', []))}
        - Cấp độ: {job['experience_level']}
        
        Danh sách ứng viên:
        {json.dumps([{
            'id': c['id'],
            'skills': c.get('skills', []),
            'experience': c.get('experience', '')[:100] + '...',
            'desired_position': c.get('desired_position', ''),
            'location': c.get('location', '')
        } for c in candidates], ensure_ascii=False, indent=2)}
        
        Hãy gợi ý TOP 3 ứng viên phù hợp nhất. Format JSON:
        {
            "recommendations": [
                {
                    "candidate_id": "id",
                    "match_percentage": 90,
                    "strengths": ["điểm mạnh 1", "điểm mạnh 2"],
                    "concerns": ["điều cần lưu ý"],
                    "interview_tips": "gợi ý phỏng vấn"
                }
            ]
        }
        """
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        return {"recommendations": response}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI recommendation failed: {str(e)}")

@api_router.post("/ai/course-recommendations/{user_id}")
async def get_course_recommendations(user_id: str):
    try:
        candidate = await db.candidates.find_one({"user_id": user_id})
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate profile not found")
        
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        session_id = f"course_rec_{user_id}_{uuid.uuid4()}"
        
        chat = LlmChat(
            api_key=api_key,
            session_id=session_id,
            system_message="Bạn là chuyên gia phát triển sự nghiệp. Hãy gợi ý các khóa học để nâng cao kỹ năng và cơ hội việc làm."
        ).with_model("openai", "gpt-4o")
        
        prompt = f"""
        Hồ sơ ứng viên:
        - Kỹ năng hiện tại: {', '.join(candidate.get('skills', []))}
        - Kinh nghiệm: {candidate.get('experience', '')}
        - Vị trí mong muốn: {candidate.get('desired_position', '')}
        
        Hãy gợi ý các khóa học để:
        1. Nâng cao kỹ năng hiện tại
        2. Học kỹ năng mới cần thiết cho vị trí mong muốn
        3. Theo kịp xu hướng ngành nghề
        
        Format JSON:
        {
            "courses": [
                {
                    "title": "Tên khóa học",
                    "provider": "Nhà cung cấp (Coursera, Udemy, v.v.)",
                    "duration": "Thời gian",
                    "skill_focus": "Kỹ năng trọng tâm",
                    "career_impact": "Tác động đến sự nghiệp",
                    "priority": "high/medium/low"
                }
            ]
        }
        """
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        return {"courses": response}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI recommendation failed: {str(e)}")

# File upload route
@api_router.post("/upload-cv/{user_id}")
async def upload_cv(user_id: str, file: UploadFile = File(...)):
    try:
        contents = await file.read()
        file_base64 = base64.b64encode(contents).decode()
        
        # Update candidate profile with CV
        await db.candidates.update_one(
            {"user_id": user_id},
            {"$set": {"cv_file": file_base64, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        return {"message": "CV uploaded successfully", "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()