export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">
              Kos<span className="text-primary-400">Hub</span>
            </h3>
            <p className="text-gray-400 text-sm">
              Integrated platform for accommodation booking and living support services.
              Find your perfect kos and manage daily needs effortlessly.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Accommodation Booking</li>
              <li>Laundry Service</li>
              <li>Catering Service</li>
              <li>24/7 Support</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Architecture</h3>
            <p className="text-gray-400 text-sm mb-2">
              Built with Domain-Driven Design (DDD) principles
            </p>
            <ul className="space-y-1 text-gray-400 text-sm">
              <li>• Accommodation Booking Context</li>
              <li>• Living Support Services Context</li>
              <li>• Microservices Architecture</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>© 2026 KosHub - II3160 UAS Project. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
