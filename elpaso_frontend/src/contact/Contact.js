import SideNavbar from "../SideNavbar";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-container">
      {" "}
      <SideNavbar />
      <div className="form-container">
        <form className="form-contact">
          <input
            name="name"
            placeholder="Introduceti numele:"
            className="input name"
            required
          />
          <input
            name="emailaddress"
            placeholder="Introduceti email-ul:"
            className="input email"
            type="email"
            required
          />
          <textarea
            rows="4"
            cols="50"
            name="subject"
            placeholder="Introduceti mesajul:"
            className="input message"
            required
          ></textarea>
          <input
            name="submit"
            className="btn"
            type="submit"
            value="Trimiteti"
          />
        </form>
      </div>
    </div>
  );
};

export default Contact;
