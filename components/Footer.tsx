"use client";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="text-gray-300">
              Built by Daniel for the Fountain Licensing Team
            </p>
            <p className="text-gray-400 text-sm mt-2">Version 1.0.0</p>
          </div>
          <div className="flex flex-wrap gap-6 justify-center">
            <a
              href="/extension.zip"
              download
              className="text-gray-300 hover:text-white transition-colors"
            >
              Download Extension
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              View README
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Report an Issue
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

