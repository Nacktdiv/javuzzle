import { SkImage, Skia, AlphaType, ColorType } from '@shopify/react-native-skia';

// DAFTAR INDEKS KELAS AKSARA JAWA (Urutan sesuai training)
const CLASS_NAMES = [
  'ba', 'ca', 'da', 'dha', 'ga', 'ha', 'ja', 'ka', 'la', 'ma', 
  'na', 'nga', 'nya', 'pa', 'pepet', 'ra', 'sa', 'ta', 'taling', 
  'taling_tarung', 'tha', 'wa', 'wulu', 'ya'
];

interface PredictionResult {
  prediction: string;
  confidence: number;
}

export const AnalyzeAksara = async (
  canvasImage: SkImage, 
  tfliteModel: any,
  normalizationType: '0_1' | '-1_1' = '0_1' // Parameter penentu model rescaling
): Promise<PredictionResult> => {
  
  if (!tfliteModel) {
    throw new Error("Model TFLite belum dimuat atau bernilai null.");
  }

  const srcWidth = canvasImage.width();
  const srcHeight = canvasImage.height();

  // 1. Ambil data piksel mentah secara eksplisit menggunakan format RGBA
  // Menggunakan parameter pembacaan agar tidak return null di beberapa platform
  // const imageInfo = {
  //   width: srcWidth,
  //   height: srcHeight,
  //   colorType: ColorType.RGBA_8888,
  //   alphaType: AlphaType.Unpremul,
  // };

  // const pixelBuffer = canvasImage.readPixels(0, 0, imageInfo);

  const pixelBuffer = canvasImage.readPixels(); // Ambil format default
    if (!pixelBuffer || pixelBuffer.length === 0) {
      throw new Error("Pixel buffer kosong atau tidak terbaca!");
  }
  
  if (!pixelBuffer) {
    throw new Error("Gagal membaca data piksel dari gambar Canvas. Pastikan library Skia terkonfigurasi dengan benar.");
  }

  // 2. Alokasikan Float32Array untuk input model (64x64x3)
  const inputSize = 64;
  const inputArray = new Float32Array(inputSize * inputSize * 3);

  // 3. Pre-processing: Mengatasi Distorsi (Letterboxing/Padding) & Resize Bilinear Sederhana
  // Menghitung skala agar gambar masuk ke 64x64 tanpa merusak aspek rasio aksara
  const scale = Math.max(srcWidth, srcHeight);
  let inputIdx = 0;

  for (let y = 0; y < inputSize; y++) {
    for (let x = 0; x < inputSize; x++) {
      
      // Transformasi koordinat dengan mempertahankan aspek rasio di tengah (Center Crop/Pad)
      const offsetX = (scale - srcWidth) / 2;
      const offsetY = (scale - srcHeight) / 2;
      
      const srcX = Math.floor(((x / inputSize) * scale) - offsetX);
      const srcY = Math.floor(((y / inputSize) * scale) - offsetY);

      let r = 255, g = 255, b = 255; // Default background putih jika di luar koordinat asli

      if (srcX >= 0 && srcX < srcWidth && srcY >= 0 && srcY < srcHeight) {
        const srcIdx = (srcY * srcWidth + srcX) * 4;
        
        // Pastikan srcIdx tidak melebihi panjang maksimum buffer
        if (srcIdx + 2 < pixelBuffer.length) {
          r = pixelBuffer[srcIdx];
          g = pixelBuffer[srcIdx + 1];
          b = pixelBuffer[srcIdx + 2];
        }
      }

      // 4. Parameter Normalisasi / Rescaling
      if (normalizationType === '-1_1') {
        // Jika model menggunakan preprocess_input MobileNetV2 (rentang -1 s.d 1)
        inputArray[inputIdx++] = (r / 127.5) - 1.0;
        inputArray[inputIdx++] = (g / 127.5) - 1.0;
        inputArray[inputIdx++] = (b / 127.5) - 1.0;
      } else {
        // Jika model menggunakan tf.keras.layers.Rescaling(1./255) (rentang 0 s.d 1)
        inputArray[inputIdx++] = r / 255.0;
        inputArray[inputIdx++] = g / 255.0;
        inputArray[inputIdx++] = b / 255.0;
      }
    }
  }

  // 5. Eksekusi Model Inferensi (Sesuaikan dengan solusi buffer/array kemarin)
  console.log("Sample Input Tensor (5 titik pertama):", [
    inputArray[0], inputArray[1], inputArray[2], inputArray[3], inputArray[4]
  ]);

  const outputs = await tfliteModel.run([inputArray.buffer]); 

  // --- PROSES UNBOXING OUTPUT TENSOR (PERBAIKAN UTAMA) ---
  let probabilities: Float32Array;

  if (outputs[0] instanceof ArrayBuffer) {
    // Jika output berupa ArrayBuffer mentah, bungkus ke Float32Array
    probabilities = new Float32Array(outputs[0]);
  } else if (outputs[0]?.buffer instanceof ArrayBuffer) {
    // Jika output adalah TypedArray yang dibungkus objek native
    probabilities = new Float32Array(outputs[0].buffer);
  } else if (Array.isArray(outputs[0])) {
    // Jika output adalah nested array biasa [[0.1, 0.2, ...]]
    probabilities = new Float32Array(outputs[0][0] ?? outputs[0]);
  } else {
    // Fallback terakhir jika bentuknya adalah objek tensor khusus
    probabilities = new Float32Array(Object.values(outputs[0]));
  }

  // Tambahkan Log untuk Debugging (Hapus jika sudah aman)
  console.log("Raw Probabilities Sample:", Array.from(probabilities).slice(0, 5));

  if (!probabilities || probabilities.length === 0 || isNaN(probabilities[0])) {
    throw new Error("Output model tidak valid atau mengembalikan NaN.");
  }

  // 6. Cari Nilai Tertinggi (Argmax)
  let maxIdx = 0;
  let maxVal = probabilities[0];

  for (let i = 1; i < probabilities.length; i++) {
    // Proteksi jika ada nilai non-number menyelinap
    if (isNaN(probabilities[i])) continue; 
    
    if (probabilities[i] > maxVal) {
      maxVal = probabilities[i];
      maxIdx = i;
    }
  }

  // 7. Return ke UI
  return {
    prediction: CLASS_NAMES[maxIdx] || "Tidak Diketahui",
    confidence: parseFloat((maxVal * 100).toFixed(2))
  };
};