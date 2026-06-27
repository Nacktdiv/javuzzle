import { Skia, ColorType, AlphaType } from '@shopify/react-native-skia';

const CLASS_NAMES = [
  'ba',  // Index 0
  'ca',  // Index 1
  'da',  // Index 2
  'dha',  // Index 3
  'ga',  // Index 4
  'ha',  // Index 5
  'ja',  // Index 6
  'ka',  // Index 7
  'la',  // Index 8
  'ma',  // Index 9
  'na',  // Index 10
  'nga',  // Index 11
  'nya',  // Index 12
  'pa',  // Index 13
  'pepet',  // Index 14
  'ra',  // Index 15
  'sa',  // Index 16
  'suku',  // Index 17
  'ta',  // Index 18
  'taling',  // Index 19
  'taling_tarung',  // Index 20
  'tha',  // Index 21
  'wa',  // Index 22
  'wulu',  // Index 23
  'ya',  // Index 24
];

interface PredictionResult {
  prediction: string;
  confidence: number;
}

interface ProcessedStrokeResult {
  pixelBuffer: Uint8Array;
}

// FUNGSI 1: Merender SATU PATH SAJA pada posisi aslinya, lalu mengecilkan kanvas global ke 64x64
export const MakeImageBufferPerPiece = (
  svgPathString: string,
  lebarKanvasAsli: number,
  tinggiKanvasAsli: number
): ProcessedStrokeResult => {
  const targetSize = 64;

  // 1. Buat surface virtual seukuran KANVAS ASLI di HP terlebih dahulu
  const surfaceAsli = Skia.Surface.Make(lebarKanvasAsli, tinggiKanvasAsli);
  if (!surfaceAsli) throw new Error("Gagal membuat surface internal");
  const canvasAsli = surfaceAsli.getCanvas();

  // Warnai background PUTIH SOLID
  const paintBg = Skia.Paint();
  paintBg.setColor(Skia.Color('#ffffff'));
  canvasAsli.drawRect(Skia.XYWHRect(0, 0, lebarKanvasAsli, tinggiKanvasAsli), paintBg);

  // 2. Load lintasan garis tunggal ini
  const path = Skia.Path.MakeFromSVGString(svgPathString);
  if (!path) throw new Error("Gagal membaca string SVG");

  const paintStroke = Skia.Paint();
  paintStroke.setColor(Skia.Color('#000000'));
  paintStroke.setStyle(1); 
  paintStroke.setStrokeWidth(10); // Ketebalan proporsional kanvas besar
  paintStroke.setStrokeCap(1); 
  paintStroke.setStrokeJoin(1); 

  // Gambar path tunggal pada KOORDINAT ASLINYA
  canvasAsli.drawPath(path, paintStroke);

  // Ambil snapshot gambar ukuran penuh
  const imageAsli = surfaceAsli.makeImageSnapshot();

  // 3. SEKARANG KITA KECILKAN (RESIZE) GAMBAR ASLI TADI SECARA GLOBAL KE 64x64
  const surface64 = Skia.Surface.Make(targetSize, targetSize);
  if (!surface64) throw new Error("Gagal membuat surface 64x64");
  const canvas64 = surface64.getCanvas();

  // Hitung skala pengecilan proporsional
  const scaleX = targetSize / lebarKanvasAsli;
  const scaleY = targetSize / tinggiKanvasAsli;
  
  const matrixScale = Skia.Matrix();
  matrixScale.scale(scaleX, scaleY);

  // FIX 1: Gunakan .concat(matrix) bukan .setMatrix() untuk mematangkan skala di SkCanvas
  canvas64.concat(matrixScale);
  
  // Gambar ulang snapshot besar tadi ke dalam kanvas kecil 64x64
  const paintCopy = Skia.Paint();
  canvas64.drawImage(imageAsli, 0, 0, paintCopy);

  // Ambil snapshot final 64x64
  const imageFinal = surface64.makeImageSnapshot();

  const imageInfo = {
    width: targetSize,
    height: targetSize,
    colorType: ColorType.RGBA_8888,
    alphaType: AlphaType.Unpremul,
  };

  const pixelBuffer = imageFinal.readPixels(0, 0, imageInfo);
  if (!pixelBuffer) throw new Error("Gagal mengekstrak piksel");

  // FIX 2: Paksa casting ke Uint8Array agar TypeScript tidak komplain tipe data gabungan
  return { pixelBuffer: pixelBuffer as Uint8Array};
};

// FUNGSI 2: Menganalisis buffer gambar masing masing yang telah dibuat
export const AnalyzeImageBuffer = async (
  pixelBuffer: Uint8Array, 
  tfliteModel: any
): Promise<PredictionResult> => {
  const inputSize = 64;
  const inputArray = new Float32Array(inputSize * inputSize * 3);
  let inputIdx = 0;

  for (let i = 0; i < pixelBuffer.length; i += 4) {
    inputArray[inputIdx++] = pixelBuffer[i] / 255.0;     
    inputArray[inputIdx++] = pixelBuffer[i + 1] / 255.0; 
    inputArray[inputIdx++] = pixelBuffer[i + 2] / 255.0; 
  }

  const outputs = await tfliteModel.run([inputArray.buffer]);

    if (outputs && outputs[0]) {
      const bytes = outputs[0].byteLength;
      const jumlahKelas = bytes / 4; 
  }

  let probabilities = new Float32Array(outputs[0]?.buffer ?? outputs[0][0] ?? outputs[0]);

  let maxIdx = 0;
  let maxVal = probabilities[0];
  for (let i = 1; i < probabilities.length; i++) {
    if (probabilities[i] > maxVal) {
      maxVal = probabilities[i];
      maxIdx = i;
    }
  }

  return {
    prediction: CLASS_NAMES[maxIdx] || "Tidak Diketahui",
    confidence: parseFloat((maxVal * 100).toFixed(2))
  };
};