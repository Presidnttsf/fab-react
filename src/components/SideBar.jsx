import "../components/SideBar.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function SideBar({ open, onClose }) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`overlay ${open ? "show" : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />

      {/* Sidebar */}
      <aside
        className={`sidebar ${open ? "active" : ""}`}
        aria-hidden={!open}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
          type="button"
        >
          ✕
        </button>

        {/* ✅ Scroll container */}
        <div className="sidebar-content">
          <form className="sidebar-form">
            <input type="text" placeholder="Full Name" />
           <PhoneInput
       country={"in"}          // default India (change if you want)
              enableSearch
              countryCodeEditable={false}
              placeholder="Mobile Number"
              inputClass="cmd-phone-input"
              buttonClass="cmd-phone-flag"
              dropdownClass="cmd-phone-dropdown"
      />
            <input type="email" placeholder="Email Address" />
            <input type="text" placeholder="City" />
            <input type="text" placeholder="Area / Location" />
            <input type="text" placeholder="Service Type" />
            <input type="date" />
            <input type="time" />
            <input type="text" placeholder="Notes / Requirement" />
            <input type="text" placeholder="Reference (Optional)" />

            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}

export default SideBar;