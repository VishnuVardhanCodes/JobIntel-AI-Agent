from qdrant_memory import (
    create_collection,
    check_duplicate,
    store_job_embedding
)

# Fake vector (same vector repeated)
test_vector = [0.1] * 384

create_collection()

if not check_duplicate(test_vector):
    store_job_embedding(test_vector)

else:
    print("Duplicate skipped")