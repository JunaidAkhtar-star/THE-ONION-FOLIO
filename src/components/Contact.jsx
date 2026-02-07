import { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import ElectricBorder from "./ElectricBorder";
import "./Contact.css";

export default function Contact() {
  const formRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatusMessage("");

    emailjs
      .sendForm(
        "service_lbtr1xq", // e.g. service_123abc
        "template_1g2dean", // e.g. template_456def
        formRef.current,
        "tVdJPp7sVH-qliNlC" // e.g. PUBLIC_789ghi
      )
      .then(
        (result) => {
          console.log("EmailJS success:", result);
          setIsSending(false);
          setStatusMessage("Message sent successfully ✅");
          formRef.current.reset();
        },
        (error) => {
          console.log("EmailJS error:", error); // <- important
          setIsSending(false);
          setStatusMessage("Something went wrong. Please try again ❌");
        }
      );
  };

  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="section-title"
        >
          Get In Touch
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="contact-subtitle"
        >
          Let&apos;s collaborate and bring your ideas to life
        </motion.p>

        <div className="contact-content">
          {/* LEFT CONTACT INFO – unchanged */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="contact-info"
          >
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div className="contact-details">
                <h3>Email</h3>
                <a href="mailto:akhtarjunaid82099@gmail.com">
                  akhtarjunaid82099@gmail.com
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">💼</div>
              <div className="contact-details">
                <h3>LinkedIn</h3>
                <a
                  href="https://www.linkedin.com/in/junaid-akhtar-7a525b286/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  click here to see linkedin
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">🐙</div>
              <div className="contact-details">
                <h3>GitHub</h3>
                <a
                  href="https://github.com/JunaidAkhtar-star"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  click here to see github
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">📱</div>
              <div className="contact-details">
                <h3>Phone</h3>
                <a href="tel:+917978459055">+91 7978459055</a>
              </div>
            </div>
          </motion.div>

          {/* RIGHT FORM – wrapped with ElectricBorder, logic unchanged */}
          <ElectricBorder
            color="#7df9ff"
            speed={1}
            chaos={0.12}
            thickness={2}
            style={{ borderRadius: 16 }}
          >
            <motion.form
              ref={formRef}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="contact-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label htmlFor="name">Name</label>
                {/* name attribute must match template variables in EmailJS */}
                <input type="text" id="name" name="user_name" required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="user_email" required />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" required />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Message"}
              </button>

              {statusMessage && (
                <p className="contact-status">{statusMessage}</p>
              )}
            </motion.form>
          </ElectricBorder>
        </div>
      </div>
    </section>
  );
}


