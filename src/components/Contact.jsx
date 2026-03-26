import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, Github, Linkedin, Twitter } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Contact = () => {
  const { addSubmission } = useContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await addSubmission({
        name: formData.name,
        email: formData.email,
        message: formData.subject ? `${formData.subject}\n\n${formData.message}` : formData.message,
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setIsSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative">
      {/* Background Effect */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[100px] pointer-events-none rounded-full"></div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-10 items-center justify-center">
          <div className="w-full lg:w-[42%] text-center lg:text-left">
            <h2 className="section-title text-4xl font-poppins font-bold mb-6">Let's <span className="text-primary">Connect</span></h2>
            <p className="text-gray-400 font-inter mb-8 leading-relaxed">
              Have a project in mind or just want to chat? Feel free to reach out. I'm always open to new opportunities and interesting conversations.
            </p>
            
            <div className="space-y-6 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 glass border border-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Mail className="text-primary group-hover:text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email</div>
                  <div className="text-lg font-medium group-hover:text-primary transition-colors">shahabas@example.com</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 glass border border-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                  <MessageSquare className="text-primary group-hover:text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Availability</div>
                  <div className="text-lg font-medium">Remote | Worldwide</div>
                </div>
              </div>
            </div>

            <div className="mt-12">
               <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-6">Find me on</h4>
               <div className="flex gap-4 justify-center lg:justify-start">
                  {[Github, Linkedin, Twitter].map((Icon, i) => (
                    <motion.a 
                      key={i} 
                      href="#" 
                      whileHover={{ scale: 1.1, y: -5 }}
                      className="w-10 h-10 glass border border-white/10 rounded-lg flex items-center justify-center hover:border-primary/50 text-gray-400 hover:text-primary transition-all duration-300"
                    >
                       <Icon size={20} />
                    </motion.a>
                  ))}
               </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-[50%] xl:w-[48%] max-w-2xl glass p-5 md:p-6 rounded-2xl border-primary/10 shadow-[0_0_36px_rgba(254,31,25,0.05)]"
          >
            <form className="space-y-3.5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange('name')}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-inter text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange('email')}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-inter text-sm"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Subject</label>
                <input 
                  type="text" 
                  placeholder="How can I help you?"
                  value={formData.subject}
                  onChange={handleChange('subject')}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-inter text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Message</label>
                <textarea 
                  rows="4"
                  placeholder="Your message here..."
                  value={formData.message}
                  onChange={handleChange('message')}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-inter text-sm resize-none"
                  required
                ></textarea>
              </div>

              {isSubmitted && (
                <p className="text-sm text-teal-500">Request Submitted. Shahabas Reach out to you soon.</p>
              )}

              <button disabled={submitting} type="submit" className="w-full py-2.5 bg-primary text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(254,31,25,0.5)] transition-all transform active:scale-[0.98] disabled:opacity-60">
                Send Message <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
