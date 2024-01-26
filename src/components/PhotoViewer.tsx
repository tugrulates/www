import { Dialog } from "@headlessui/react";
import { useState } from "react";

interface Props {
  image?: JSX.Element;
  openButton?: JSX.Element;
  closeButton?: JSX.Element;
}

export default function PhotoViewer(props: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return isOpen ? (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-50"
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <Dialog.Title className="sr-only">Viewing image</Dialog.Title>
      <Dialog.Panel
        onClick={() => {
          setIsOpen(false);
        }}
        className="fixed inset-0 flex h-screen w-screen transform items-center justify-center overflow-hidden overflow-y-auto bg-gradient-to-b from-stone-400 to-stone-300 align-middle dark:from-stone-600 dark:to-stone-700 "
      >
        <div className="group/cover h-fit w-fit bg-stone-200/20">
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
        </div>
      </Dialog.Panel>
    </Dialog>
  ) : (
    <button
      aria-label="Expand image"
      onClick={() => {
        setIsOpen(true);
      }}
      className="group"
    >
      {props.openButton}
    </button>
  );
}
