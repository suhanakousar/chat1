import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { FaEnvelope, FaUser, FaCheckCircle, FaArrowRight } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    loading: false,
    error: false,
    message: "",
  });

  const form = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setFormStatus({ ...formStatus, loading: true });

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        }
      )
      .then(
        () => {
          setFormStatus({
            submitted: true,
            loading: false,
            error: false,
            message: "Thank you for your message! We'll get back to you soon.",
          });
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.log("FAILED...", error.text);
          setFormStatus({
            submitted: false,
            loading: false,
            error: true,
            message: "Something went wrong. Please try again.",
          });
        }
      );
  };

  return (
    <div className="relative py-32 bg-gradient-to-br from-white via-neutral-50 to-white overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 gradient-mesh opacity-20"></div>
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-right">
            <div className="inline-flex items-center space-x-2 px-5 py-2 glass rounded-full border border-primary-200">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-gradient-cyan">Get in Touch</span>
            </div>

            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-display font-bold text-neutral-900 leading-[1.1]">
                Let's Start a
                <br />
                <span className="text-gradient">Conversation</span>
              </h2>
              
              <div className="h-1 w-32 bg-gradient-to-r from-primary-500 via-accent-500 to-aurora-500 rounded-full"></div>
            </div>

            <p className="text-xl text-neutral-600 leading-relaxed">
              Have questions or feedback? We're here to help you break down language barriers and connect globally.
            </p>

            <div className="space-y-4">
              <div className="group relative glass-frosted p-6 rounded-3xl border border-primary-200 hover:border-primary-400 transition-all duration-300 hover:shadow-glow">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                <div className="relative flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-glow">
                    <FaEnvelope className="text-xl text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900 mb-1 text-lg">Email Us</div>
                    <div className="text-neutral-600">support@chatlas.com</div>
                  </div>
                </div>
              </div>

              <div className="group relative glass-frosted p-6 rounded-3xl border border-accent-200 hover:border-accent-400 transition-all duration-300 hover:shadow-glow-accent">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                <div className="relative flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl shadow-glow-accent">
                    <FaUser className="text-xl text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900 mb-1 text-lg">24/7 Support</div>
                    <div className="text-neutral-600">Always here when you need us</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="relative glass rounded-3xl p-8 md:p-10 border border-neutral-200 shadow-depth animate-slide-left">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-neutral-50/50 rounded-3xl"></div>
            
            {formStatus.submitted ? (
              <div className="relative text-center py-12 space-y-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-aurora-500/20 rounded-full blur-2xl animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-aurora-500 to-aurora-600 rounded-full flex items-center justify-center mx-auto shadow-glow-aurora">
                    <FaCheckCircle className="text-4xl text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-display font-bold text-neutral-900">Message Sent!</h3>
                <p className="text-lg text-neutral-600">{formStatus.message}</p>
                <button
                  onClick={() => setFormStatus({ submitted: false, loading: false, error: false, message: "" })}
                  className="inline-flex items-center px-6 py-3 glass-frosted hover:bg-white/60 text-neutral-700 font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form ref={form} onSubmit={sendEmail} className="relative space-y-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-3">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-5 py-4 bg-white border-2 border-neutral-200 rounded-2xl
                             focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
                             transition-all duration-200 placeholder:text-neutral-400
                             hover:border-neutral-300 text-neutral-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-5 py-4 bg-white border-2 border-neutral-200 rounded-2xl
                             focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
                             transition-all duration-200 placeholder:text-neutral-400
                             hover:border-neutral-300 text-neutral-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-3">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    rows="5"
                    className="w-full px-5 py-4 bg-white border-2 border-neutral-200 rounded-2xl
                             focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
                             transition-all duration-200 placeholder:text-neutral-400
                             hover:border-neutral-300 resize-none text-neutral-900"
                    required
                  />
                </div>

                {formStatus.error && (
                  <div className="p-4 bg-error/10 border-2 border-error/30 text-error rounded-2xl text-sm font-medium">
                    {formStatus.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formStatus.loading}
                  className="w-full relative inline-flex items-center justify-center gap-3 px-8 py-4 
                           bg-gradient-to-r from-primary-600 to-accent-600 text-white text-lg font-bold 
                           rounded-2xl shadow-glow hover:shadow-neon-cyan
                           hover:scale-105 active:scale-95 transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                           overflow-hidden group"
                >
                  {formStatus.loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span className="absolute inset-0 bg-gradient-to-r from-accent-600 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative z-10">Send Message</span>
                      <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
