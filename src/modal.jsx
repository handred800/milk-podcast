export default function Modal({ isShowing, toggle, children }) {
  return (
    <div className={`modal ${isShowing ? "is-active" : ""}`}>
      <div className="modal-background" onClick={toggle}></div>
      <div className="modal-content">
        <div className="box content">{children}</div>
      </div>
    </div>
  );
}
