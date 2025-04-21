import pandas as pd
from pmdarima import auto_arima
import sys
import os

def predict_merit(file_path, target_year):
    try:
        # Load Excel or CSV
        if file_path.endswith(".csv"):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)

        # Extract year columns like 2018–2025
        year_columns = [col for col in df.columns if str(col).isdigit()]
        year_columns = sorted([int(col) for col in year_columns])
        last_year = year_columns[-1]

        # Check if target year is already present
        if str(target_year) in df.columns or int(target_year) in year_columns:
            print("already exists")
            return

        # Target must be next year
        if int(target_year) != last_year + 1:
            print(f"invalid year: must be {last_year + 1}")
            return

        predictions = []
        for index, row in df.iterrows():
            try:
                series = row[[str(y) for y in year_columns]].astype(float)
                model = auto_arima(series, seasonal=False, suppress_warnings=True)
                forecast = model.predict(n_periods=1)
                predictions.append(round(forecast[0], 2))
            except Exception as e:
                predictions.append(None)
                print(f"Error in row {index}: {e}")

        # Add new year column
        df[str(target_year)] = predictions

        # Save updated file as JSON
        output_dir = os.path.abspath(os.path.join("career_counseling", "frontend", "public", "data"))
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, "Merit_Predictions.json")

        print("\n🟢 Attempting to write JSON...")
        print(f"➡️ Output directory: {output_dir}")
        print(f"➡️ Full path: {output_path}")

        df.to_json(output_path, orient="records", indent=2)

        # Confirm file was written
        if os.path.exists(output_path):
            print("✅ JSON file saved!")
            print(output_path)
        else:
            print("❌ JSON file NOT found after writing.")

    except Exception as e:
        print(f"Script Error: {e}")

if __name__ == "__main__":
    file_path = sys.argv[1]
    target_year = sys.argv[2]
    predict_merit(file_path, target_year)