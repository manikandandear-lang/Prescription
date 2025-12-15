import React, { useState, useRef } from 'react';
import Header from './components/Header';
import PrescriptionDetails from './components/PrescriptionDetails';
import { analyzePrescription } from './services/geminiService';
import { PrescriptionData } from './types';
import { UploadCloud, FileImage, Loader2, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [data, setData] = useState<PrescriptionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setData(null);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setData(null);
      setError(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const resetApp = () => {
    setFile(null);
    setPreviewUrl(null);
    setData(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const processImage = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = reader.result as string;
        // Remove data url prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64String.split(',')[1];
        const mimeType = file.type;

        try {
          const result = await analyzePrescription(base64Data, mimeType);
          setData(result);
        } catch (err: any) {
          setError(err.message || "Failed to analyze prescription. Please try again.");
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.onerror = () => {
        setError("Error reading file.");
        setIsAnalyzing(false);
      };
    } catch (err) {
      setError("An unexpected error occurred.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro Section - Hide when data is present to save space, or keep small */}
        {!data && !isAnalyzing && (
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Decipher Prescriptions in Seconds
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Upload a photo of your medical prescription. Our AI identifies medication names, dosages, and instructions instantly.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Upload & Preview */}
          <div className={`lg:col-span-${data ? '4' : '12'} transition-all duration-500 ease-in-out`}>
            
            {/* Upload Area */}
            {!previewUrl && (
              <div 
                onClick={triggerFileInput}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
                  ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-medical-500 hover:bg-medical-50'}
                `}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div className="flex flex-col items-center justify-center">
                  <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                    <UploadCloud className="h-8 w-8 text-medical-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Click to upload or drag and drop</h3>
                  <p className="mt-1 text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                </div>
              </div>
            )}

            {/* Preview Area */}
            {previewUrl && (
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                <div className="relative aspect-[3/4] w-full bg-gray-100 rounded-xl overflow-hidden mb-4 group">
                  <img 
                    src={previewUrl} 
                    alt="Prescription Preview" 
                    className="w-full h-full object-contain" 
                  />
                  {/* Overlay for re-uploading on hover */}
                  {!isAnalyzing && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button 
                            onClick={resetApp}
                            className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium text-sm flex items-center shadow-lg hover:bg-gray-50"
                         >
                             <RefreshCw size={16} className="mr-2" />
                             Upload New
                         </button>
                      </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center text-sm text-gray-500 truncate max-w-[70%]">
                      <FileImage size={16} className="mr-2 flex-shrink-0" />
                      <span className="truncate">{file?.name}</span>
                   </div>
                   {!data && !isAnalyzing && (
                       <button 
                         onClick={resetApp}
                         className="text-xs text-gray-500 hover:text-red-500 underline"
                       >
                         Remove
                       </button>
                   )}
                </div>

                {!data && !isAnalyzing && (
                  <button
                    onClick={processImage}
                    className="mt-6 w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-medical-600 hover:bg-medical-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-500 transition-colors"
                  >
                    Analyze Prescription
                  </button>
                )}
                
                {isAnalyzing && (
                    <div className="mt-6 w-full py-3 px-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-medical-700 text-sm font-medium">
                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                        Analyzing with Gemini...
                    </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200 text-red-600 text-sm">
                <p className="font-medium">Analysis Failed</p>
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          {data && (
            <div className="lg:col-span-8 animate-fade-in-up">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
                 <button 
                   onClick={resetApp}
                   className="hidden lg:flex items-center text-sm text-gray-500 hover:text-medical-600 transition-colors"
                 >
                   <RefreshCw size={16} className="mr-1" />
                   Analyze Another
                 </button>
               </div>
               <PrescriptionDetails data={data} />
            </div>
          )}
        </div>
      </main>
      
      {/* Simple Footer */}
      <footer className="mt-auto py-8 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} ScriptScan. Private & Secure.</p>
      </footer>
    </div>
  );
};

export default App;