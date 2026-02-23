import "../components/SideBar.css"

function SideBar({ open, onClose }) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`overlay ${open ? "show" : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />

      {/* Sidebar Drawer (RIGHT) */}
      <aside className={`sidebar ${open ? "active" : ""}`} aria-hidden={!open}>
        <button
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
          type="button"
        >
          ✕
        </button>

   <form className="sidebar-form">
          <input type="text" placeholder="Full Name" />
          <input type="tel" placeholder="Mobile Number" />
          <input type="email" placeholder="Email Address" />
          <input type="text" placeholder="City" />
          <input type="text" placeholder="Area / Location" />
          <input type="text" placeholder="Service Type" />
          <input type="date" placeholder="Preferred Date" />
          <input type="time" placeholder="Preferred Time" />
          <input type="text" placeholder="Notes / Requirement" />
          <input type="text" placeholder="Reference (Optional)" />

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>    </aside>
    </>
  );
}

export default SideBar;