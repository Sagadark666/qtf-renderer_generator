import React, { ReactNode, useEffect, useRef, useState } from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const [modalStyle, setModalStyle] = useState({});
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const updateModalPosition = () => {
        if (modalRef.current) {
          const rect = modalRef.current.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          const sidebarWidth = 200; // Adjust according to your sidebar width

          let left = (viewportWidth - sidebarWidth - rect.width) / 2 + sidebarWidth;
          let top = viewportHeight * 0.2; // Set the top position to 20% of the viewport height

          left = Math.max(sidebarWidth, Math.min(left, viewportWidth - rect.width));
          top = Math.max(0, Math.min(top, viewportHeight - rect.height));

          setModalStyle({
            left: `${left}px`,
            top: `${top}px`,
            position: 'fixed',
            maxWidth: '90vw',
            maxHeight: '90vh',
            width: '80%',
          });
        }
      };

      updateModalPosition();
      window.addEventListener('resize', updateModalPosition);

      return () => {
        window.removeEventListener('resize', updateModalPosition);
      };
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef} style={modalStyle}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
