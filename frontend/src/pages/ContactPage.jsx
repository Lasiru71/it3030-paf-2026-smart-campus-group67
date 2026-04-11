import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Clock, 
  MessageSquare, 
  Plus, 
  Minus 
} from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [activeFaq, setActiveFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
  };

  const faqs = [
    {
      q: "How do I cancel a booking?",
      a: "You can cancel any active booking from your 'My Bookings' page at least 2 hours before the start time."
    },
    {
      q: "What if I lose an equipment item?",
      a: "Please report lost items immediately via this contact form or visit the security office in the main lobby."
    },
    {
      q: "Can I book resources for a student club?",
      a: "Yes! Use your student credentials. For large events, please select 'Event Hall' and provide club details."
    }
  ];

  return (
    <MainLayout>
      {/* Hero Header - Vibrant Gradient */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 text-white py-24 md:py-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-sky-400 blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-500 blur-3xl opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sky-200 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
            <MessageSquare className="h-4 w-4" />
            Support Center
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Got Questions? We have <span className="text-sky-300">Answers.</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Our team is here to help you with anything related to resource management and campus bookings.
          </p>
        </div>
      </section>

      {/* Main Content Area - Soft Sections */}
      <div className="relative bg-slate-50/50">
        {/* Subtle background blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-blue-100/30 blur-[120px] pointer-events-none -z-10" />

        <section className="py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              
              {/* Contact Sidebar */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 underline decoration-blue-500 decoration-4 underline-offset-8">Get in Touch</h2>
                  <p className="text-slate-500 mb-8 leading-relaxed">
                    Prefer direct contact? Use any of the following channels to reach our administrative office.
                  </p>
                </div>

                {[
                  { icon: Mail, label: "Email Us", val: "support@campusreserve.edu", color: "text-blue-600 bg-blue-100" },
                  { icon: Phone, label: "Call Us", val: "+94 11 234 5678", color: "text-emerald-600 bg-emerald-100" },
                  { icon: MapPin, label: "Visit Us", val: "Main Admin Block, University Campus", color: "text-amber-600 bg-amber-100" },
                  { icon: Clock, label: "Office Hours", val: "Mon - Fri, 8:00 AM - 5:00 PM", color: "text-purple-600 bg-purple-100" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-6 rounded-2xl border border-white transition-all group hover:shadow-xl hover:bg-white bg-white/60 backdrop-blur-sm">
                    <div className={`${item.color} h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                      <p className="text-slate-800 font-bold">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/5 border border-white p-8 md:p-12 relative overflow-hidden">
                  {/* Internal decoration */}
                  <div className="absolute top-0 right-0 h-32 w-32 bg-blue-50 rounded-full -mr-16 -mt-16 -z-10" />
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center md:text-left">Send us a Message</h3>
                  <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                    <Input 
                      label="Full Name" 
                      id="name" 
                      placeholder="Hasindu Chanuka" 
                      required 
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                    />
                    <Input 
                      label="Email Address" 
                      id="email" 
                      type="email" 
                      placeholder="you@university.edu" 
                      required 
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                    />
                    <div className="md:col-span-2">
                      <Input 
                        label="Subject" 
                        id="subject" 
                        placeholder="How can we help?" 
                        required 
                        value={form.subject}
                        onChange={(e) => setForm({...form, subject: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-700">Your Message</label>
                      <textarea 
                        id="message" 
                        rows={5} 
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 bg-slate-50/50"
                        placeholder="Tell us more about your inquiry..."
                        required
                        value={form.message}
                        onChange={(e) => setForm({...form, message: e.target.value})}
                      ></textarea>
                    </div>
                    <div className="md:col-span-2">
                      <Button type="submit" fullWidth className="py-4 shadow-xl shadow-blue-200 bg-blue-700 hover:bg-blue-800">
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - Colored Background */}
        <section className="py-24 bg-gradient-to-b from-transparent to-blue-50/50 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-4">
                Frequently Asked Questions
              </h2>
              <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full mb-4" />
              <p className="text-slate-500">Quick answers to the questions we hear most often.</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm ${
                    activeFaq === i 
                      ? "border-blue-200 bg-white border-l-4 border-l-blue-600 shadow-lg translate-x-1" 
                      : "border-white bg-white/80 backdrop-blur-sm hover:border-blue-200 hover:shadow-md"
                  }`}
                >
                  <button 
                    className="w-full flex items-center justify-between p-6 text-left transition-colors"
                    onClick={() => setActiveFaq(activeFaq === i ? -1 : i)}
                  >
                    <span className={`font-bold transition-colors ${activeFaq === i ? "text-blue-900" : "text-slate-800"}`}>
                      {faq.q}
                    </span>
                    <div className={`p-1.5 rounded-lg transition-colors ${activeFaq === i ? "bg-blue-100" : "bg-slate-100"}`}>
                      {activeFaq === i ? (
                        <Minus className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Plus className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </button>
                  {activeFaq === i && (
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="h-px w-full bg-blue-50 mb-4" />
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default ContactPage;

