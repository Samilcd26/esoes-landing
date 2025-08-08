"use client";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useEmailService } from "@/hooks/useEmailService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const tContact = useTranslations("contact");
  const { sendContactFormEmail, isLoading } = useEmailService();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      return;
    }

    const success = await sendContactFormEmail(formData);
    
    if (success) {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Beams */}
      <BackgroundBeams className="opacity-60" variant="contact" />
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
              {tContact("header.title")}
            </h1>
            <p className="relative z-10 text-lg md:text-xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-300 to-neutral-500 max-w-2xl mx-auto">
              {tContact("header.description1")}
              <br />
              {tContact("header.description2")}
            </p>
          </motion.div>

       
         
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <h2 className="relative z-10 text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-center font-sans font-bold mb-6">
              {tContact("form.title")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="relative z-10 block bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-400 font-medium mb-2">
                    {tContact("form.fullNameLabel")}
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder={tContact("form.fullNamePlaceholder")}
                    required
                  />
                </div>
                <div>
                  <Label className="relative z-10 block bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-400 font-medium mb-2">
                    {tContact("form.emailLabel")}
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder={tContact("form.emailPlaceholder")}
                    required
                  />
                </div>
              </div>
              <div>
                <Label className="relative z-10 block bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-400 font-medium mb-2">
                  {tContact("form.subjectLabel")}
                </Label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder={tContact("form.subjectPlaceholder")}
                  required
                />
              </div>
              <div>
                <Label className="relative z-10 block bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-400 font-medium mb-2">
                  {tContact("form.messageLabel")}
                </Label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder={tContact("form.messagePlaceholder")}
                  required
                />
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? tContact("form.sendingButton") : tContact("form.sendButton")}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
