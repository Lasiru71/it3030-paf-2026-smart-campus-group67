// Footer component
import { Link } from "react-router-dom";
import Logo from "../common/Logo";
import { ROUTES } from "../../utils/constants";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Logo className="text-white mb-3" />
            <p className="text-sm leading-relaxed">
              The all-in-one university resource booking platform. Reserve lecture halls, equipment, and campus facilities effortlessly.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", to: ROUTES.HOME },
                { label: "Resources", to: ROUTES.RESOURCES },
                { label: "About", to: ROUTES.ABOUT },
                { label: "Contact", to: ROUTES.CONTACT },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-sky-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 support@campusreserve.edu</li>
              <li>📞 +94 11 234 5678</li>
              <li>📍 University Campus, Colombo</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} CampusReserve. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
