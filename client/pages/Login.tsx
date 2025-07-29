import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, Eye, EyeOff, Loader2, AlertCircle, Shield } from "lucide-react";

// Types for keystroke tracking
interface KeyEventData {
  key: string;
  type: 'down' | 'up';
  time: number;
}

interface KeystrokeMetrics {
  [key: string]: number;
}

interface ApiResponse {
  status: 'Normal' | 'Anomaly';
  anomaly_confidence_percent: number;
  raw_score: number;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState<string>("");
  const [anomalyScore, setAnomalyScore] = useState<number>(0);

  // Keystroke tracking refs
  const keyEvents = useRef<KeyEventData[]>([]);
  const mistakeCounter = useRef<number>(0);
  const isShiftDown = useRef<boolean>(false);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const { setAuthState } = useAuth();
  const navigate = useNavigate();
  

  // Keystroke tracking functions
  const calculateKeystrokeMetrics = (allEvents: KeyEventData[]): KeystrokeMetrics => {
    const TARGET_KEYS = ['.', 't', 'i', 'e', '5', 'R', 'o', 'a', 'n', 'l', 'Enter'];
    const keyMap: { [key: string]: string } = { 
      '.': 'period', 't': 't', 'i': 'i', 'e': 'e', '5': 'five', 
      'R': 'Shift.r', 'o': 'o', 'a': 'a', 'n': 'n', 'l': 'l', 'Enter': 'Return' 
    };
    const timings: { [key: string]: number } = {};

    const findLastEvent = (key: string, type: 'down' | 'up'): KeyEventData | null => {
      for (let i = allEvents.length - 1; i >= 0; i--) {
        if (allEvents[i].key === key && allEvents[i].type === type) return allEvents[i];
      }
      return null;
    };

    try {
      for (const key of TARGET_KEYS) {
        const down = findLastEvent(key, 'down');
        const up = findLastEvent(key, 'up');
        if (!down || !up) throw new Error(`A press or release for the key '${key}' was not detected.`);
        timings[`H.${keyMap[key]}`] = up.time - down.time;
      }

      for (let i = 0; i < TARGET_KEYS.length - 1; i++) {
        const k1 = TARGET_KEYS[i], k2 = TARGET_KEYS[i + 1];
        const d1 = findLastEvent(k1, 'down');
        const u1 = findLastEvent(k1, 'up');
        const d2 = findLastEvent(k2, 'down');
        if (!d1 || !u1 || !d2) throw new Error(`Missing event for pair ${k1}-${k2}`);
        const col = `${keyMap[k1]}.${keyMap[k2]}`;
        timings[`DD.${col}`] = d2.time - d1.time;
        timings[`UD.${col}`] = d2.time - u1.time;
      }
    } catch (error) {
      console.error("Metric calculation failed:", (error as Error).message);
      throw error;
    }

    // Debug: Log captured key events
    console.log('Captured key events:', allEvents.map(e => ({
      key: e.key,
      type: e.type,
      time: e.time
    })));

    const finalMetrics: KeystrokeMetrics = {};
    for (const key in timings) {
      finalMetrics[key] = parseFloat((timings[key] / 1000).toFixed(4));
    }
    return finalMetrics;
  };

  const resetKeystrokeTracking = () => {
    keyEvents.current = [];
    mistakeCounter.current = 0;
    isShiftDown.current = false;
  };

  // Setup keystroke tracking
  useEffect(() => {
    const inputElement = passwordInputRef.current;
    if (!inputElement) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') isShiftDown.current = true;
      if (e.key === 'Backspace') mistakeCounter.current++;
      
      const lastEvent = keyEvents.current[keyEvents.current.length - 1];
      if (lastEvent && lastEvent.key === e.key && lastEvent.type === 'down') return;
      
      keyEvents.current.push({ 
        key: e.key, 
        type: 'down', 
        time: performance.now() 
      });
      if (e.key === 'Enter') e.preventDefault();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') isShiftDown.current = false;
      keyEvents.current.push({ 
        key: e.key, 
        type: 'up', 
        time: performance.now() 
      });
      
      if (e.key === 'Enter') {
        // Get current value directly from input element
        const currentPassword = inputElement.value;
        handleBiometricLogin(currentPassword);
      }
    };

    inputElement.addEventListener('keydown', handleKeyDown);
    inputElement.addEventListener('keyup', handleKeyUp);

    return () => {
      inputElement.removeEventListener('keydown', handleKeyDown);
      inputElement.removeEventListener('keyup', handleKeyUp);
    };
  }, []); // Empty dependency array ensures this runs once

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission is now handled by the Enter key in the password field
    // This is just a fallback for button clicks
    handleBiometricLogin(password);
  };

const handleBiometricLogin = async (currentPassword: string) => {
    setError("");
    setBiometricStatus("");
    setAnomalyScore(0);
    
    // --- RECOMMENDED FIX: Add this validation block ---
    if (!email.trim() || !currentPassword.trim()) {
      setError("Email and password are required.");
      setIsSubmitting(false); // Ensure the button is re-enabled
      return; // Stop the function here
    }
    // --- End of fix ---

    setIsSubmitting(true);

    try {
      // Calculate keystroke metrics
      let keystrokeMetrics: KeystrokeMetrics;
      try {
        keystrokeMetrics = calculateKeystrokeMetrics(keyEvents.current);
      } catch (error) {
        setError("Keystroke data invalid. Please try again.");
        resetKeystrokeTracking();
        setIsSubmitting(false);
        return;
      }

      // Prepare biometric data
      const biometricData = {
        mistake_counter: mistakeCounter.current,
        ...keystrokeMetrics,
      };

      // Add debug logging for keystroke data
      console.log('Attempting biometric login with data:', {
        email,
        passwordLength: currentPassword.length,
        keystrokeEvents: keyEvents.current.length,
        metrics: keystrokeMetrics
      });

      const response = await fetch('http://localhost:5000/api/auth/biometric-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: currentPassword,
          keystrokeData: biometricData,
        }),
      });

      // Add response status logging
      console.log('API Response Status:', response.status);
      const result = await response.json();
      console.log('API Response Body:', {
        success: result.success,
        error: result.error,
        biometricConfidence: result.biometric_confidence
      });

      if (result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        setBiometricStatus("success");
        setAnomalyScore(result.biometric_confidence || 0);
        setAuthState(result.user, result.token); 
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setError(result.error || "Authentication failed");
        if (result.anomaly_confidence !== undefined) {
          setAnomalyScore(result.anomaly_confidence);
          setBiometricStatus("failed");
        }
      }
    } catch (error) {
      console.error('Detailed login error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
      resetKeystrokeTracking();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-banking-blue-600 to-banking-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white rounded-lg p-3 mr-3">
              <CreditCard className="h-10 w-10 text-banking-blue-600" />
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold">SecureBank</h1>
              <p className="text-blue-100">Online Banking</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome Back
            </CardTitle>
            <p className="text-gray-600">Sign in to your account</p>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    ref={passwordInputRef}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {biometricStatus && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Shield className={`h-4 w-4 ${
                      biometricStatus === 'success' ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <span className={
                      biometricStatus === 'success' ? 'text-green-600' : 'text-red-600'
                    }>
                      {biometricStatus === 'success' 
                        ? 'Biometric verification successful' 
                        : 'Biometric verification failed'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="rounded border-gray-300 text-banking-blue-600 focus:ring-banking-blue-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-banking-blue-600 hover:text-banking-blue-700"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-banking-blue-600 hover:bg-banking-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Don't have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/register">Create new account</Link>
                </Button>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Demo Credentials
              </h3>
              <div className="text-xs text-blue-700 space-y-1">
                <p>
                  <strong>Test Account 1:</strong><br />
                  Email: pranavm2323@gmail.com<br />
                  Password: .tie5Roanl
                </p>
                <p className="mt-2">
                  <strong>Test Account 2:</strong><br />
                  Email: priyankaavijay04@gmail.com<br />
                  Password: .tie5Roanl
                </p>
                <p className="text-blue-600 mt-2">
                  <strong>Note:</strong> Biometric authentication is enabled. 
                  Your typing pattern will be verified along with the password.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-blue-100 text-sm">
          <p>© 2024 SecureBank. All rights reserved.</p>
          <p>Your security is our priority</p>
        </div>
      </div>
    </div>
  );
}
