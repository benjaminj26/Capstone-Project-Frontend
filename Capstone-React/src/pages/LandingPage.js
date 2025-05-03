import React from "react";
import weddingPng from "../assets/icons/wedding.png";
import bdayPng from "../assets/icons/bdaysvg.png";
import partyPng from "../assets/icons/party.png";
import conferencePng from "../assets/icons/conference.png";
import vendorImage from "../assets/vendorpics/vendor.jpg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPageOne = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden mx-auto max-w-7xl px-6 py-32 text-center flex flex-col items-center">
        {/* Decorative Blobs */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 0.15 }} 
          transition={{ duration: 1 }}
          className="absolute -top-10 -left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply blur-2xl opacity-70 animate-blob"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 0.15 }} 
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute -bottom-16 -right-16 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply blur-2xl opacity-70 animate-blob animation-delay-2000"
        ></motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6"
        >
          Effortless Planning, Memorable Events.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl"
        >
          Orchestrate unforgettable moments with ease and elegance — let us handle the details while you enjoy the celebration.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex gap-4 justify-center"
        >
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl shadow-md transition"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
          <button
            className="bg-white border border-gray-300 hover:border-gray-400 text-gray-800 font-medium px-6 py-3 rounded-xl shadow-sm transition"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
  className="bg-gray-100 border border-gray-300 hover:border-gray-400 text-gray-800 font-medium px-6 py-3 rounded-xl shadow-sm transition"
  onClick={() => navigate("/tutorials")}
>
  View Tutorial
</button>

        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Plan Events for Every Occasion</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {[{
              title: "Weddings", icon: weddingPng, desc: "Happily Ever After, Starts Now."
            }, {
              title: "Birthdays", icon: bdayPng, desc: "Excuse to Eat Cake & Celebrate."
            }, {
              title: "Parties", icon: partyPng, desc: "Unforgettable nights of fun!"
            }, {
              title: "Conferences", icon: conferencePng, desc: "Connect, Collaborate, Create."
            }].map((item, i) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 shadow hover:shadow-lg transition text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <img src={item.icon} alt={item.title} className="h-12 w-12 object-contain" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1"
            >
              <img src={vendorImage} alt="Vendor" className="rounded-2xl shadow-lg w-full object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Join as a Vendor</h2>
              <p className="text-gray-700 text-lg mb-6">
                Showcase your services to a broad audience and grow your business by connecting with event planners and customers directly.
              </p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl shadow-md transition"
                onClick={() => navigate("/vendorregistration")}
              >
                Register as Vendor
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto text-center px-6">
          <motion.h2 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            transition={{ duration: 0.6 }} 
            className="text-3xl font-bold text-gray-900 mb-6"
          >
            Ready to Plan Your Next Event?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            transition={{ delay: 0.2 }} 
            className="text-lg text-gray-700 mb-8"
          >
            Join us today and make your event planning journey seamless and delightful!
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-xl shadow-md transition"
            onClick={() => navigate("/register")}
          >
            Get Started Now
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} EPMS. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageOne;
