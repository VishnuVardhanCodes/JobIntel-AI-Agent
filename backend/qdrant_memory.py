from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import os
import uuid
from dotenv import load_dotenv

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

COLLECTION_NAME = "jobintel_memory"


# ✅ Create collection if not exists
def create_collection():

    try:
        # Delete old collection (RESET)
        client.delete_collection(COLLECTION_NAME)
        print("Old collection deleted ✅")

    except Exception:
        pass

    # Create fresh collection
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=384,
            distance=Distance.COSINE
        )
    )

    print("Fresh collection created ✅")


# ✅ Generate dummy vector (temporary embedding)
def generate_vector(text):

    # Temporary dummy embedding
    return [0.1] * 384


# ✅ Check duplicate
def check_duplicate(text):

    vector = generate_vector(text)

    search_result = client.query_points(
        collection_name=COLLECTION_NAME,
        query=vector,
        limit=1
    )

    if search_result.points:

        score = search_result.points[0].score

        if score > 0.99:

            print("⚠️ Duplicate job detected")
            return True

    return False


# ✅ Store job
def store_job(text):

    vector = generate_vector(text)

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            PointStruct(
                id=str(uuid.uuid4()),
                vector=vector,
                payload={"text": text}
            )
        ]
    )

    print("✅ Job stored in memory")


# Run once to create collection
if __name__ == "__main__":

    create_collection()