import React from 'react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10 flex flex-col items-center justify-start">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center text-yellow-400">
          Contact Us
        </h1>
        {/* <p className="text-center text-gray-300 mb-10">
          Have questions, feedback, or facing issues? Reach out to us — we're here to help!
        </p> */}
        <p className="text-center text-gray-300 mb-10 text-xl">
  Have questions, feedback, or facing issues? Reach out to us — we're here to help!
</p>



        

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <form className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-md">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded transition"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <div className="space-y-6 text-lg bg-gray-800 p-6 rounded-lg shadow-md">
            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-2">Get in Touch</h2>
              <p><strong>Email:</strong> contact@sqlmystery.com</p>
              <p><strong>Phone:</strong> +91-98765-43210</p>
              <p><strong>Address:</strong> Department of Computer Science, National Institute of Technology Karnataka,Surathkal</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-yellow-400 mb-2">Quick Links</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li><a href="/faqs" className="hover:text-yellow-300 transition">FAQs</a></li>
                <li><a href="/support" className="hover:text-yellow-300 transition">Support</a></li>
                <li><a href="/profile#case-history" className="hover:text-yellow-300 transition">Case History</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
