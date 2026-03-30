import os
import uuid
import json
import time
from qdrant_client import QdrantClient, models
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
from config import logger

# Load environment variables
load_dotenv()

# Get Qdrant credentials
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

# Create client
client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY
)

COLLECTION_NAME = "jobintel_memory_v2"

# Initialize Embedding Model (all-MiniLM-L6-v2 is 384 dimensions)
try:
    logger.info("🧠 Loading SentenceTransformer model (all-MiniLM-L6-v2)...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    logger.info("✅ Model loaded successfully.")
except Exception as e:
    logger.error(f"❌ Failed to load model: {e}")
    model = None

def create_collection():
    """
    Creates/Resets the Qdrant collection with 384 dimensions for all-MiniLM-L6-v2.
    """
    try:
        # Delete old collection if exists
        client.delete_collection(COLLECTION_NAME)
        logger.info(f"Old collection {COLLECTION_NAME} deleted ✅")
    except Exception:
        pass

    # Create fresh collection
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=models.VectorParams(
            size=384,
            distance=models.Distance.COSINE
        )
    )
    
    # Create payload index for post_id for faster deduplication
    client.create_payload_index(
        collection_name=COLLECTION_NAME,
        field_name="post_id",
        field_schema=models.PayloadSchemaType.KEYWORD,
    )
    
    logger.info(f"Fresh collection {COLLECTION_NAME} created with 384 dimensions and post_id index ✅")

def generate_vector(text):
    """
    Generates real embeddings using SentenceTransformer.
    """
    if model:
        return model.encode(text).tolist()
    return [0.0] * 384

def check_duplicate(post_id):
    """
    Checks if a job exists in memory by its raw post_id.
    """
    if not post_id or post_id == "Not specified":
        return False

    try:
        search_result = client.scroll(
            collection_name=COLLECTION_NAME,
            scroll_filter=models.Filter(
                must=[
                    models.FieldCondition(
                        key="post_id", 
                        match=models.MatchValue(value=post_id)
                    )
                ]
            ),
            limit=1
        )

        if search_result[0]:
            logger.info(f"⚠️ Duplicate job detected (post_id: {post_id})")
            return True
    except Exception as e:
        if "Index required" in str(e):
            logger.info(f"Creating missing index for post_id...")
            try:
                client.create_payload_index(
                    collection_name=COLLECTION_NAME,
                    field_name="post_id",
                    field_schema=models.PayloadSchemaType.KEYWORD,
                )
                # Try again once
                return check_duplicate(post_id)
            except:
                pass
        logger.warning(f"Error checking duplicate in Qdrant: {e}")

    return False

def store_job(job_data):
    """
    Stores job data and its skill embeddings in Qdrant.
    """
    try:
        if isinstance(job_data, str):
            job_data = json.loads(job_data)

        # We embed the primary skills for semantic matching
        skills_text = ", ".join(job_data.get("primary_skills", []))
        if not skills_text:
            skills_text = job_data.get("role", "General Job")

        vector = generate_vector(skills_text)

        client.upsert(
            collection_name=COLLECTION_NAME,
            points=[
                models.PointStruct(
                    id=str(uuid.uuid4()),
                    vector=vector,
                    payload=job_data
                )
            ]
        )
        logger.info(f"✅ Job {job_data.get('post_id')} stored in memory with skill embeddings.")
    except Exception as e:
        logger.error(f"❌ Failed to store job in memory: {e}")

def semantic_match(user_skills, limit=5):
    """
    Matches user skills against stored jobs using vector search.
    """
    query_vector = generate_vector(", ".join(user_skills))
    
    search_results = client.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_vector,
        limit=limit,
        with_payload=True
    )

    matches = []
    for res in search_results:
        matches.append({
            "job": res.payload,
            "score": res.score
        })
    
    return matches

if __name__ == "__main__":
    # Initialize collection
    create_collection()
    
    # Test Storage
    test_job = {
        "post_id": "test_001",
        "role": "Python Developer",
        "company_name": "TestCorp",
        "primary_skills": ["Python", "FastAPI", "PostgreSQL"]
    }
    store_job(test_job)
    
    # Wait for consistency
    time.sleep(1)
    
    # Test Duplicate
    print(f"Is Duplicate? {check_duplicate('test_001')}")
    
    # Test Semantic Match
    print("Semantic matches for 'FastAPI':")
    print(semantic_match(["FastAPI"]))