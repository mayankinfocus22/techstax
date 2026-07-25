import { useState, useRef } from "react";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  DollarSign,
  Trash2,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { api, ApiError } from "../lib/api";

export function DropResumePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mouse position states for background spotlight
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100
    });
  };

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [expectedDailyRate, setExpectedDailyRate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  // UI State
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const allowedTypes = [
      "application/pdf", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setStatus({ type: "error", message: "Please upload a valid PDF or DOCX file." });
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      setStatus({ type: "error", message: "File size exceeds the 5MB limit." });
      return;
    }

    setFile(selectedFile);
    setStatus(null);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !file) {
      setStatus({ type: "error", message: "Please fill out all required fields and upload your CV." });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      if (phone.trim()) formData.append("phone", phone.trim());
      if (expectedDailyRate.trim()) formData.append("expectedDailyRate", expectedDailyRate.trim());
      formData.append("resume", file);

      await api.post<{ message: string }>("/cv/submit", formData, false);
      
      setStatus({
        type: "success",
        message: "Thank you! Your CV and details have been registered. Our team will contact you for matching client roles."
      });
      
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setExpectedDailyRate("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof ApiError ? err.message : "Something went wrong. Please try again later."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="relative min-h-[calc(100vh-140px)] bg-space-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 50, y: 50 });
      }}
    >
      {/* Background Skyline Accent with Spotlight effect */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        {/* Base background image - slightly visible */}
        <img 
          src="/skyline.jpg" 
          alt="" 
          className="h-full w-full object-cover mix-blend-luminosity filter brightness-[0.8] contrast-125 opacity-[0.05] absolute inset-0"
        />
        {/* Spotlight image layer - brightens around mouse */}
        <img 
          src="/skyline.jpg" 
          alt="" 
          style={{
            transition: "opacity 0.4s ease-out",
            opacity: isHovered ? 0.35 : 0,
            WebkitMaskImage: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, black 20%, transparent 100%)`,
            maskImage: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, black 20%, transparent 100%)`
          }}
          className="absolute inset-0 h-full w-full object-cover mix-blend-luminosity filter brightness-[0.95] contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-space-950 via-transparent to-space-950" />
      </div>

      {/* Decorative background blurs */}
      <div className="absolute top-1/4 left-1/3 size-[350px] rounded-full bg-gold-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 size-[350px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-gold-500 mb-6 transition">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="panel p-6 sm:p-8 bg-white/[0.01] border border-white/10 backdrop-blur-md shadow-float rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-gold-500 via-brand-500 to-accent" />
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Submit your CV</h1>
          {status?.type === "success" ? (
            <div className="mt-6 p-6 bg-emerald-950/20 rounded-2xl border border-emerald-500/20 text-center">
              <CheckCircle2 className="size-12 text-emerald-400 mx-auto" />
              <h3 className="mt-3 font-bold text-emerald-300 text-base">Submission Complete</h3>
              <p className="mt-2 text-sm text-emerald-400/90 leading-relaxed">{status.message}</p>
              <button 
                type="button" 
                onClick={() => setStatus(null)} 
                className="mt-6 btn-secondary w-full"
              >
                Submit Another CV
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {status?.type === "error" && (
                <div className="p-4 bg-rose-950/30 border border-rose-500/20 rounded-xl text-xs font-semibold text-rose-300 flex gap-2.5 items-start">
                  <AlertCircle className="size-4 shrink-0 text-rose-450 mt-0.5" />
                  <span>{status.message}</span>
                </div>
              )}

              {/* Name Input */}
              <div>
                <label htmlFor="name" className="label">Full Name <span className="text-gold-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="label">Email Address <span className="text-gold-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="label">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      type="tel"
                      id="phone"
                      placeholder="+61 400 000 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input pl-10"
                    />
                  </div>
                </div>

                {/* Expected Daily Rate */}
                <div>
                  <label htmlFor="rate" className="label">Expected Daily Rate (AUD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      type="number"
                      id="rate"
                      placeholder="e.g. 900"
                      value={expectedDailyRate}
                      onChange={(e) => setExpectedDailyRate(e.target.value)}
                      className="input pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* File Dropzone */}
              <div>
                <span className="label">Upload CV (PDF or DOCX) <span className="text-gold-500">*</span></span>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={handleFileChange}
                  onClick={(e) => e.stopPropagation()}
                />

                {!file ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
                      dragActive 
                        ? "border-gold-500 bg-gold-500/10 shadow-[0_0_20px_rgba(229,193,88,0.15)]" 
                        : "border-white/10 hover:border-gold-500/60 hover:bg-white/[0.02]"
                    }`}
                  >
                    <UploadCloud className="size-9 text-gold-500/80 mb-2.5 transition-transform duration-300" />
                    <p className="text-sm font-bold text-slate-200">Drag your CV file here</p>
                    <p className="text-xs text-slate-400 mt-1">or click to browse from device (Max 5MB)</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between border border-gold-500/25 bg-gold-500/5 rounded-2xl p-4 shadow-md">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid size-10 place-items-center rounded-xl bg-space-900 text-gold-500 border border-white/5">
                        <FileText size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{file.name}</p>
                        <p className="text-xs text-slate-450 mt-0.5">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-white/5 transition"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3.5 mt-6 text-sm font-bold"
              >
                {submitting ? "Submitting..." : "Submit CV"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
