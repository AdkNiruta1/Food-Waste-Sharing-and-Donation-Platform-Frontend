import React from "react";

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">Last Updated: March 2026</p>

      <h2 className="text-xl font-semibold mt-6">1. Information We Collect</h2>
      <ul className="list-disc ml-6 mt-2">
        <li>Personal details (name, email, phone number)</li>
        <li>Location information for food pickup</li>
        <li>Uploaded content (food images, descriptions)</li>
        <li>Usage data and activity logs</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">2. How We Use Your Information</h2>
      <ul className="list-disc ml-6 mt-2">
        <li>Connect donors and recipients</li>
        <li>Facilitate food donation requests</li>
        <li>Improve platform services</li>
        <li>Send notifications</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">3. Sharing of Information</h2>
      <p className="mt-2">
        We do not sell your data. Information may be shared between users and
        service providers when necessary.
      </p>

      <h2 className="text-xl font-semibold mt-6">4. Data Security</h2>
      <p className="mt-2">
        We use reasonable security measures to protect your data, but no system
        is completely secure.
      </p>

      <h2 className="text-xl font-semibold mt-6">5. Cookies and Sessions</h2>
      <p className="mt-2">
        We use cookies and session authentication to maintain login sessions.
      </p>

      <h2 className="text-xl font-semibold mt-6">6. Your Rights</h2>
      <ul className="list-disc ml-6 mt-2">
        <li>Access your data</li>
        <li>Update or delete your account</li>
        <li>Request data removal</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">7. Changes to Policy</h2>
      <p className="mt-2">
        We may update this policy. Changes will be posted here.
      </p>

      <h2 className="text-xl font-semibold mt-6">8. Contact Us</h2>
      <p className="mt-2">Email: annapurnabhandar@gmail.com</p>
    </div>
  );
};

export default Privacy;