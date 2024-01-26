import { Dialog } from "@headlessui/react";
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
          <Dialog.Panel
            onClick={() => {
              setIsOpen(false);
              openButtonRef.current?.focus();
            }}
            className=""
          >
            <Dialog.Title className="sr-only">Viewing image</Dialog.Title>
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
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
