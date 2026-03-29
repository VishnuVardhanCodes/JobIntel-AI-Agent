import time
from main_pipeline import run_pipeline


def start_runner():

    print("🚀 JobIntel Runner Started...\n")

    while True:

        try:

            print("\n⏳ Running pipeline...")

            run_pipeline()

            print("\n✅ Cycle completed")

        except Exception as e:

            print("❌ Error occurred:")
            print(e)

        # Wait 5 minutes
        print("\n⏱ Waiting 1 minutes...\n")

        time.sleep(60)


if __name__ == "__main__":

    start_runner()