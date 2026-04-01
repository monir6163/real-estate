"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, MapPin, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Animated 404 Text */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text animate-pulse">
                404
              </div>
              <Search className="absolute -bottom-4 -right-4 w-12 h-12 text-blue-500 opacity-60 animate-bounce" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-sm text-gray-500">
            It might have been moved or deleted. Let's get you back on track.
          </p>
        </div>

        {/* Illustration */}
        <div className="flex justify-center mb-12">
          <div className="relative w-64 h-48">
            <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-4 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-blue-400 mx-auto mb-2 opacity-60" />
                <p className="text-sm text-gray-600 font-medium">
                  Lost in space?
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              Back to Dashboard
            </Button>
          </Link>

          <Link href="/properties">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Browse Properties
            </Button>
          </Link>
        </div>

        {/* Additional Links */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Quick Navigation
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors hover:underline"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/properties"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors hover:underline"
              >
                <Search className="w-4 h-4" />
                All Properties
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors hover:underline"
              >
                <MapPin className="w-4 h-4" />
                Contact Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            If you believe this is a mistake, please{" "}
            <button className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              contact us
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
