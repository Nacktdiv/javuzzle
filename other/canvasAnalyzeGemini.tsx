import { GoogleGenAI, Type } from '@google/genai'; // 💡 Tambahkan impor Type untuk skema

const GOOGLE_API_KEYS = process.env.EXPO_PUBLIC_GOOGLE_API_KEYS

const MODELS = [
    'gemma-4-31b-it',
    'gemma-4-26b-a4b-it'
];

function createEffectiveJavanesePrompt(sukuKata: string): string {
  return `
    ## Tugas: Analisis Multimodal Canvas Aksara Jawa

    **INPUT DATA:**
    - **Suku Kata Target:** "${sukuKata}"

    ---

    **INSTRUKSI ANALISIS:**
    Harap analisis gambar kanvas Aksara Jawa yang dikirimkan. Evaluasi kecocokan coretan gambar dengan suku kata target "${sukuKata}".
    Isi field JSON yang diminta dengan ketentuan:
    1. **accuracy**: Berikan nilai integer antara 0 sampai 100 yang merepresentasikan tingkat akurasi dan kesesuaian tulisan kanvas dibandingkan standar Aksara Jawa asli.
    2. **feedback**: Berikan penjelasan detail mengenai bagian mana yang sudah bagus, aksara dasar/sandhangan apa saja yang terdeteksi, serta kritik konstruktif jika ada goresan yang kurang tepat atau penempatan sandhangan yang keliru. Gunakan Bahasa Indonesia yang sopan dan jelas.
  `;
}

export default async function AskGemini (tipe: string, base64Data: string, mimeType: string ): Promise<string> {
    let keyIndex = 0;
    let modelIndex = 0;

    while (keyIndex < GOOGLE_API_KEYS.length) {
        modelIndex = 0; 
        
        while (modelIndex < MODELS.length) {
            try {
                console.log(`Mencoba API Key indeks ke-${keyIndex}, Model: ${MODELS[modelIndex]}`);

                const imageParts = [
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: base64Data
                        },
                    },
                ];

                const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEYS[keyIndex] });
                const response = await ai.models.generateContent({
                    model: MODELS[modelIndex],
                    contents: [
                        {
                            role: 'user',
                            parts: imageParts,
                        },
                        {
                            role: 'user',
                            parts: [{ text: createEffectiveJavanesePrompt(tipe) }],
                        },
                    ],
                    config: {
                        systemInstruction: `
                            Kamu adalah pakar dan Juru Tulis Aksara Jawa digital. 
                            Tugasmu adalah menganalisis kebenaran coretan kanvas Aksara Jawa dari pengguna berdasarkan suku kata target yang diminta.
                            Kamu wajib merespons strictly dalam format JSON sesuai spesifikasi responseSchema yang diberikan.
                        `,
                        // ✨ MEMAKSA JAWABAN FORMAT JSON TERSTRUKTUR ✨
                        responseMimeType: 'application/json',
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                accuracy: {
                                    type: Type.INTEGER,
                                    description: 'Nilai persentase tingkat kemiripan/keakuratan tulisan (0-100).',
                                },
                                feedback: {
                                    type: Type.STRING,
                                    description: 'Analisis detail mengenai goresan, aksara nglegena, sandhangan yang terdeteksi, serta saran perbaikan.',
                                },
                            },
                            required: ['accuracy', 'feedback'],
                        },
                    },
                });

                if (response.text) {
                    return response.text; 
                }
                throw new Error("Respons kosong dari Gemini");

            } catch (err: any) {
                console.warn(`Gagal pada Key ${keyIndex} - Model ${MODELS[modelIndex]}: ${err.message}`);
                modelIndex++; // Jika gagal, coba model berikutnya
            }
        }
        keyIndex++; 
    }
    throw new Error("Semua API Key dan Model gagal memproses permintaan.");
}