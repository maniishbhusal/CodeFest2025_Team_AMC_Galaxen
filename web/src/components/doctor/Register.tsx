import React, { useState } from "react";
import {
  FileText,
  Image,
  Upload,
  User,
  Mail,
  Lock,
  Phone,
  Building,
  Award,
  Briefcase,
  CreditCard,
  Stethoscope,
} from "lucide-react";

export default function DoctorRegistration() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    license_number: "",
    specialization: "",
    years_of_experience: "",
    clinic_hospital_name: "",
    government_id: "",
  });
  const [files, setFiles] = useState({
    license_certificate: null,
    government_id_file: null,
    selfie: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles({
        ...files,
        [name]: selectedFiles[0],
      });
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate successful registration without API call
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);

      // Reset form
      setFormData({
        email: "",
        password: "",
        full_name: "",
        phone: "",
        license_number: "",
        specialization: "",
        years_of_experience: "",
        clinic_hospital_name: "",
        government_id: "",
      });
      setFiles({
        license_certificate: null,
        government_id_file: null,
        selfie: null,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Doctor Registration
          </h1>
          <p className="text-lg text-gray-600">
            Join our medical network and help patients in need
          </p>
        </div>

        {/* Alert Messages */}
        {success && (
          <div className="mb-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-orange-500 rounded-xl shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-orange-900 mb-1">
                  Application Submitted Successfully!
                </h3>
                <p className="text-orange-800">
                  Thank you for registering. Your application is now under
                  review. Our admin team will verify your credentials and notify
                  you once your account is approved. You will be able to login
                  after approval.
                </p>
                <div className="mt-3 flex items-center text-sm text-orange-700 bg-orange-100 rounded-lg px-3 py-2 w-fit">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Status: Waiting for approval
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <User className="w-6 h-6 mr-2 text-blue-600" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name (as per license) *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    maxLength={255}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Dr. Your Full Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    maxLength={254}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    maxLength={20}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="+977 9800000000"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Government-issued ID Number *
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="government_id"
                    value={formData.government_id}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Citizenship / Passport Number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Award className="w-6 h-6 mr-2 text-blue-600" />
              Professional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Council Registration Number *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="NMC Registration Number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization *
                </label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white"
                  >
                    <option value="">Select Specialization</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Speech Therapist">Speech Therapist</option>
                    <option value="Psychologist">Psychologist</option>
                    <option value="Psychiatrist">Psychiatrist</option>
                    <option value="Occupational Therapist">
                      Occupational Therapist
                    </option>
                    <option value="Special Educator">Special Educator</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="years_of_experience"
                    value={formData.years_of_experience}
                    onChange={handleChange}
                    required
                    min="0"
                    max="50"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Years of experience"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinic/Hospital Name *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="clinic_hospital_name"
                    value={formData.clinic_hospital_name}
                    onChange={handleChange}
                    required
                    maxLength={255}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Your clinic or hospital name"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Upload className="w-6 h-6 mr-2 text-blue-600" />
              Document Verification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical License Certificate *
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-500 transition">
                  <input
                    type="file"
                    name="license_certificate"
                    onChange={handleFileChange}
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center pointer-events-none">
                    <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">
                      {files.license_certificate
                        ? files.license_certificate.name
                        : "Click to upload certificate"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, JPG, JPEG, PNG
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Government ID Document *
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-500 transition">
                  <input
                    type="file"
                    name="government_id_file"
                    onChange={handleFileChange}
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center pointer-events-none">
                    <CreditCard className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">
                      {files.government_id_file
                        ? files.government_id_file.name
                        : "Click to upload ID"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Citizenship or Passport
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recent Selfie *
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-500 transition">
                  <input
                    type="file"
                    name="selfie"
                    onChange={handleFileChange}
                    required
                    accept=".jpg,.jpeg,.png"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center pointer-events-none">
                    <Image className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">
                      {files.selfie
                        ? files.selfie.name
                        : "Click to upload photo"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Recent photo for verification
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registering...
                </span>
              ) : (
                "Complete Registration"
              )}
            </button>

            <p className="mt-6 text-gray-600">
              Already have an account?{" "}
              <a
                href="/doctor/login"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition"
              >
                Login here
              </a>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
