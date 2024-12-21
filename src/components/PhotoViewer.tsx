import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { JSX } from "react";
import { createRef, useState } from "react";

interface Props {
  image?: JSX.Element;
  openButton?: JSX.Element;
  closeButton?: JSX.Element;
}

export default function PhotoViewer(props: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const openButtonRef = createRef<HTMLButtonElement>();
  return (
    <div>
      <button
        ref={openButtonRef}
        aria-label="Expand image"
        onClick={() => {
          setIsOpen(true);
        }}
        className="group"
      >
        {props.openButton}
      </button>
      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-stone-400 to-stone-300 align-middle dark:from-stone-600 dark:to-stone-700" />
        <div className="group/cover fixed inset-0 z-50 flex w-screen items-center justify-center">
          <DialogPanel
            onClick={() => {
              setIsOpen(false);
              openButtonRef.current?.focus();
            }}
            className=""
          >
            <DialogTitle className="sr-only">Viewing image</DialogTitle>
            {props.image}
            <button
              aria-label="Close image"
              onClick={() => {
                setIsOpen(true);
              }}
              className="group absolute right-2 top-2"
            >
              {props.closeButton}
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
