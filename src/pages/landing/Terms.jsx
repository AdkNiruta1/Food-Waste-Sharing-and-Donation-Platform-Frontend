import React from "react";

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
      <p className="mb-4">Last Updated: March 2026</p>

      <h2 className="text-xl font-semibold mt-6">1. Platform Purpose</h2>
      <p className="mt-2">
        Annapurna Bhandar connects food donors with recipients to reduce food waste.
      </p>

      <h2 className="text-xl font-semibold mt-6">2. User Responsibilities</h2>
      <ul className="list-disc ml-6 mt-2">
        <li>Provide accurate information</li>
        <li>Use the platform responsibly</li>
        <li>Avoid misuse of the system</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">3. Donations</h2>
      <ul className="list-disc ml-6 mt-2">
        <li>Donors are responsible for food quality</li>
        <li>Recipients should verify food before accepting</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">4. Prohibited Activities</h2>
      <ul className="list-disc ml-6 mt-2">
        <li>Posting false information</li>
        <li>Illegal activities</li>
        <li>Harassment of users</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">5. Limitation of Liability</h2>
      <p className="mt-2">
        Annapurna Bhandar is not responsible for food quality or disputes between users.
      </p>

      <h2 className="text-xl font-semibold mt-6">6. Account Suspension</h2>
      <p className="mt-2">
        We may suspend accounts that violate these terms.
      </p>

      <h2 className="text-xl font-semibold mt-6">7. Changes to Terms</h2>
      <p className="mt-2">
        Terms may be updated anytime. Continued use means acceptance.
      </p>

      <h2 className="text-xl font-semibold mt-6">8. Contact</h2>
      <p className="mt-2">Email: annapurnabhandar@gmail.com</p>
    </div>
  );
};

export default Terms;