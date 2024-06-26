import React, { useEffect, useRef } from 'react';

interface ShadowDomComponentProps {
  htmlContent: string;
  onSubmit: (formData: Record<string, any>) => void;
}

const ShadowDomComponent: React.FC<ShadowDomComponentProps> = ({ htmlContent, onSubmit }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let shadowRoot: ShadowRoot;

    if (containerRef.current) {
      // Check if a shadow root already exists
      if (containerRef.current.shadowRoot) {
        shadowRoot = containerRef.current.shadowRoot;
        shadowRoot.innerHTML = '';
      } else {
        shadowRoot = containerRef.current.attachShadow({ mode: 'open' });
    }

    shadowRoot.innerHTML = htmlContent;

    // Attach dynamic event listener within shadow DOM
    const form = shadowRoot.querySelector('form') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = Array.from(new FormData(form).entries()).reduce((data, [key, value]) => {
                data[key] = value;
                return data;
            }, {} as Record<string, any>);
            onSubmit(formData);
        });
    }
}

return () => {
    // Clean up the shadow root on unmount or update
    if (containerRef.current && containerRef.current.shadowRoot) {
        containerRef.current.shadowRoot.innerHTML = '';
    }
};
}, [htmlContent, onSubmit]);

return <div ref={containerRef} />;
};

export default ShadowDomComponent;
