import React from "react";
import { FaGithub } from "react-icons/fa";
import "../../styles/footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          Thank you for visiting MileTracker!{" "}
          <a
            href="https://github.com/LiebeAnnette/MileTracker"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <FaGithub size={24} />
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
