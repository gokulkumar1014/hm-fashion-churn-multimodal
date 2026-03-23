import onnxruntime as ort
from pathlib import Path

def inspect_model():
    base_dir = Path(__file__).resolve().parent
    model_path = base_dir / "assets" / "visionary_champion_quantized.onnx"
    session = ort.InferenceSession(str(model_path))
    
    print("Inputs:")
    for inp in session.get_inputs():
        print(f"Name: {inp.name}, Shape: {inp.shape}, Type: {inp.type}")
        
    print("\nOutputs:")
    for out in session.get_outputs():
        print(f"Name: {out.name}, Shape: {out.shape}, Type: {out.type}")

if __name__ == "__main__":
    inspect_model()
