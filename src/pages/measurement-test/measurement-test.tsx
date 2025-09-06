import React, { useState, useRef, useCallback } from 'react';
import {
  createMeasurementService,
  validateDependencies,
  type MeasurementResult,
  type PhotoInput,
  MeasurementError,
} from '../../services/measurement';

// Inline components using Tailwind
const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'outline';
}> = ({ children, onClick, disabled, className = '', variant = 'default' }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  const variantClasses = variant === 'outline' 
    ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400'
    : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
};

const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

const Spinner: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  return (
    <div className={`animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 ${className}`}></div>
  );
};

interface ProgressState {
  progress: number;
  stage: string;
}

interface TestState {
  isInitializing: boolean;
  isProcessing: boolean;
  isInitialized: boolean;
  frontPhoto: File | null;
  sidePhoto: File | null;
  height: string;
  result: MeasurementResult | null;
  error: string | null;
  progress: ProgressState;
  dependenciesValid: boolean;
}

export default function MeasurementTest() {
  const [state, setState] = useState<TestState>({
    isInitializing: false,
    isProcessing: false,
    isInitialized: false,
    frontPhoto: null,
    sidePhoto: null,
    height: '170',
    result: null,
    error: null,
    progress: { progress: 0, stage: '' },
    dependenciesValid: false,
  });

  const serviceRef = useRef<ReturnType<typeof createMeasurementService> | null>(null);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const sideInputRef = useRef<HTMLInputElement>(null);

  // Check dependencies on mount
  React.useEffect(() => {
    const validation = validateDependencies();
    setState(prev => ({
      ...prev,
      dependenciesValid: validation.isValid,
      error: validation.isValid ? null : `Missing dependencies: ${validation.missing.join(', ')}`,
    }));
  }, []);

  const updateProgress = useCallback((progress: number, stage: string) => {
    setState(prev => ({
      ...prev,
      progress: { progress, stage },
    }));
  }, []);

  const handleFileChange = (type: 'front' | 'side') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setState(prev => ({
        ...prev,
        [type === 'front' ? 'frontPhoto' : 'sidePhoto']: file,
        error: null,
      }));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      height: e.target.value,
      error: null,
    }));
  };

  const initializeService = async () => {
    if (!state.dependenciesValid) {
      setState(prev => ({ ...prev, error: 'Dependencies not available' }));
      return;
    }

    setState(prev => ({
      ...prev,
      isInitializing: true,
      error: null,
    }));

    try {
      serviceRef.current = createMeasurementService({
        poseDetectionThreshold: 0.6,
        segmentationThreshold: 0.7,
        smoothingFactor: 0.8,
      });

      await serviceRef.current.initialize(updateProgress);

      setState(prev => ({
        ...prev,
        isInitialized: true,
        isInitializing: false,
        progress: { progress: 1, stage: 'Service ready!' },
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isInitializing: false,
        error: error instanceof Error ? error.message : 'Initialization failed',
      }));
    }
  };

  const processPhotos = async () => {
    if (!serviceRef.current || !state.frontPhoto || !state.sidePhoto) {
      setState(prev => ({ ...prev, error: 'Missing photos or service not initialized' }));
      return;
    }

    const heightNum = parseFloat(state.height);
    if (isNaN(heightNum) || heightNum <= 0 || heightNum > 300) {
      setState(prev => ({ ...prev, error: 'Please enter a valid height between 1-300 cm' }));
      return;
    }

    setState(prev => ({
      ...prev,
      isProcessing: true,
      error: null,
      result: null,
    }));

    try {
      const input: PhotoInput = {
        frontPhoto: state.frontPhoto,
        sidePhoto: state.sidePhoto,
        heightInCm: heightNum,
      };

      const result = await serviceRef.current.extractMeasurementsWithRetry(
        input,
        2, // max retries
        updateProgress
      );

      setState(prev => ({
        ...prev,
        result,
        isProcessing: false,
        progress: { progress: 1, stage: 'Measurements extracted successfully!' },
      }));
    } catch (error) {
      let errorMessage = 'Processing failed';
      
      if (error instanceof MeasurementError) {
        errorMessage = `${error.code}: ${error.message}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: errorMessage,
      }));
    }
  };

  const reset = () => {
    if (serviceRef.current) {
      serviceRef.current.dispose();
      serviceRef.current = null;
    }

    setState({
      isInitializing: false,
      isProcessing: false,
      isInitialized: false,
      frontPhoto: null,
      sidePhoto: null,
      height: '170',
      result: null,
      error: null,
      progress: { progress: 0, stage: '' },
      dependenciesValid: state.dependenciesValid,
    });

    // Clear file inputs
    if (frontInputRef.current) frontInputRef.current.value = '';
    if (sideInputRef.current) sideInputRef.current.value = '';
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (serviceRef.current) {
        serviceRef.current.dispose();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Measurement Service Test
          </h1>
          <p className="text-gray-600">
            Test the AI-powered body measurement extraction service
          </p>
        </div>

        {/* Dependencies Status */}
        <Card className="mb-6">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Dependencies Status</h2>
            <div className={`p-3 rounded-lg ${state.dependenciesValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {state.dependenciesValid ? '✅ All dependencies available' : '❌ Missing dependencies'}
            </div>
          </div>
        </Card>

        {/* Service Initialization */}
        <Card className="mb-6">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Service Initialization</h2>
            
            {!state.isInitialized && !state.isInitializing && (
              <Button
                onClick={initializeService}
                disabled={!state.dependenciesValid}
                className="w-full"
              >
                Initialize Measurement Service
              </Button>
            )}

            {state.isInitializing && (
              <div className="text-center">
                <Spinner className="mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {state.progress.stage} ({Math.round(state.progress.progress * 100)}%)
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${state.progress.progress * 100}%` }}
                  />
                </div>
              </div>
            )}

            {state.isInitialized && (
              <div className="bg-green-100 text-green-800 p-3 rounded-lg">
                ✅ Service initialized and ready
              </div>
            )}
          </div>
        </Card>

        {/* Photo Upload */}
        {state.isInitialized && (
          <Card className="mb-6">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Upload Photos</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Front Photo
                  </label>
                  <input
                    ref={frontInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange('front')}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {state.frontPhoto && (
                    <p className="text-sm text-green-600 mt-1">
                      ✅ {state.frontPhoto.name}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Side Photo
                  </label>
                  <input
                    ref={sideInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange('side')}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  {state.sidePhoto && (
                    <p className="text-sm text-green-600 mt-1">
                      ✅ {state.sidePhoto.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={state.height}
                  onChange={handleHeightChange}
                  min="1"
                  max="300"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter height in centimeters"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={processPhotos}
                  disabled={!state.frontPhoto || !state.sidePhoto || state.isProcessing}
                  className="flex-1"
                >
                  {state.isProcessing ? 'Processing...' : 'Extract Measurements'}
                </Button>
                
                <Button
                  onClick={reset}
                  variant="outline"
                  disabled={state.isInitializing || state.isProcessing}
                >
                  Reset
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Processing Progress */}
        {state.isProcessing && (
          <Card className="mb-6">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Processing</h2>
              <div className="text-center">
                <Spinner className="mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  {state.progress.stage}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${state.progress.progress * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(state.progress.progress * 100)}%
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Error Display */}
        {state.error && (
          <Card className="mb-6">
            <div className="p-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                <strong>Error:</strong> {state.error}
              </div>
            </div>
          </Card>
        )}

        {/* Results */}
        {state.result && (
          <Card className="mb-6">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Measurement Results</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Measurements */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Body Measurements</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Bust:</span>
                      <span className="font-medium">{state.result.measurements.bust.toFixed(1)} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Waist:</span>
                      <span className="font-medium">{state.result.measurements.waist.toFixed(1)} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hip:</span>
                      <span className="font-medium">{state.result.measurements.hip.toFixed(1)} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Height:</span>
                      <span className="font-medium">{state.result.measurements.height.toFixed(1)} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shoulder Width:</span>
                      <span className="font-medium">{state.result.measurements.shoulderWidth.toFixed(1)} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Arm Length:</span>
                      <span className="font-medium">{state.result.measurements.armLength.toFixed(1)} cm</span>
                    </div>
                  </div>
                </div>

                {/* Dress Sizes */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Dress Sizes</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>US Size:</span>
                      <span className="font-medium">{state.result.dressSize.us}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>UK Size:</span>
                      <span className="font-medium">{state.result.dressSize.uk}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>EU Size:</span>
                      <span className="font-medium">{state.result.dressSize.eu}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900 mb-2">Confidence</h3>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          state.result.confidence > 0.8 ? 'bg-green-500' :
                          state.result.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${state.result.confidence * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {(state.result.confidence * 100).toFixed(1)}% confidence
                    </p>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">Processing Details</h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Processing time: {state.result.metadata.processingTimeMs.toFixed(0)}ms</p>
                  <p>Front photo landmarks: {state.result.metadata.frontPhotoLandmarks}</p>
                  <p>Side photo landmarks: {state.result.metadata.sidePhotoLandmarks}</p>
                  <p>Processed at: {state.result.metadata.processedAt.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Instructions</h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>1. Dependencies:</strong> Ensure all required dependencies are loaded</p>
              <p><strong>2. Initialize:</strong> Click "Initialize Measurement Service" to load AI models</p>
              <p><strong>3. Upload Photos:</strong> Upload clear front and side photos</p>
              <p><strong>4. Enter Height:</strong> Provide accurate height in centimeters</p>
              <p><strong>5. Process:</strong> Click "Extract Measurements" to analyze photos</p>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900 mb-1">Photo Tips:</p>
                <ul className="text-blue-800 text-xs space-y-1">
                  <li>• Use well-lit photos with plain backgrounds</li>
                  <li>• Stand straight with arms slightly away from body</li>
                  <li>• Front photo should be directly facing the camera</li>
                  <li>• Side photo should be a perfect 90° profile</li>
                  <li>• Wear form-fitting clothes that show body shape</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
