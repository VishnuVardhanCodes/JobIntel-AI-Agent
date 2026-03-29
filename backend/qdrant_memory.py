from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import os
import uuid
from dotenv import load_dotenv

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY
)

COLLECTION_NAME = "jobintel_memory"


def create_collection():
    try:
        client.get_collection(COLLECTION_NAME)
        print("Collection already exists ✅")

    except Exception:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=384,
                distance=Distance.COSINE
            )
        )
        print("Collection created successfully ✅")


# ✅ Check if job already exists
def check_duplicate(vector):

    search_result = client.query_points(
        collection_name=COLLECTION_NAME,
        query=vector,
        limit=1
    )

    if search_result.points:
        score = search_result.points[0].score

        # If similarity high → duplicate
        if score > 0.90:
            print("⚠️ Duplicate job detected")
            return True

    return False


# ✅ Store new job
def store_job_embedding(vector):

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            PointStruct(
                id=str(uuid.uuid4()),
                vector=vector
            )
        ]
    )

    print("✅ Job stored in memory")


if __name__ == "__main__":
    create_collection() 