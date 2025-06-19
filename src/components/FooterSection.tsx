
const FooterSection = () => {
  return (
    <footer className="bg-gray-900 text-white py-16 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-hc-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-2xl font-inter font-semibold">HealConnect</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Guided support for your healing journey. Connect with trusted wellness mentors and build lasting wellness habits.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                📷
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">YouTube</span>
                📺
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Platform</h3>
            <div className="space-y-4">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Browse Mentors</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Wellness Library</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Community</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Mobile App</a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Support</h3>
            <div className="space-y-4">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Help Center</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Contact Us</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Crisis Resources</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Safety Guidelines</a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Legal</h3>
            <div className="space-y-4">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Medical Disclaimer</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2024 HealConnect. All rights reserved.
          </div>
          <div className="text-gray-400 text-sm mt-4 md:mt-0">
            Made with 💚 for healing communities worldwide
          </div>
        </div>

        {/* Final Disclaimer */}
        <div className="mt-8 text-xs text-gray-500 text-center max-w-4xl mx-auto leading-relaxed">
          HealConnect is not a substitute for professional medical or mental health treatment. 
          Our mentors provide wellness guidance and support but are not licensed therapists or medical professionals. 
          Always consult with qualified healthcare providers for medical concerns and mental health treatment.
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
